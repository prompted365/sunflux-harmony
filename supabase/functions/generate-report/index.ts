import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { generateReportHtml } from './utils/reportTemplate.ts'
import { transformCalculationToReportData } from './utils/dataTransformer.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { calculationId } = await req.json()
    
    if (!calculationId) {
      throw new Error('Calculation ID is required')
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch calculation data with property information
    const { data: calculation, error: calcError } = await supabase
      .from('solar_calculations')
      .select(`
        *,
        properties (
          address,
          city,
          state,
          zip_code
        )
      `)
      .eq('id', calculationId)
      .single()

    if (calcError || !calculation) {
      throw new Error('Failed to fetch calculation data')
    }

    const propertyAddress = `${calculation.properties.address}, ${calculation.properties.city}, ${calculation.properties.state} ${calculation.properties.zip_code}`
    
    // Transform data and generate HTML
    const reportData = transformCalculationToReportData(calculation, propertyAddress)
    const htmlContent = generateReportHtml(reportData)

    // Store the HTML report with correct content type
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const fileName = `report_${calculationId}_${timestamp}.html`
    const filePath = `reports/${fileName}`

    const { error: uploadError } = await supabase
      .storage
      .from('reports')
      .upload(filePath, htmlContent, {
        contentType: 'text/html; charset=utf-8',
        upsert: false
      })

    if (uploadError) {
      throw new Error('Failed to upload report')
    }

    // Create signed URL for viewing
    const { data: { signedUrl }, error: urlError } = await supabase
      .storage
      .from('reports')
      .createSignedUrl(filePath, 60 * 60 * 24 * 7, { // 7 days expiry
        transform: {
          metadata: {
            'content-type': 'text/html; charset=utf-8'
          }
        }
      })

    if (urlError) {
      throw new Error('Failed to generate report URL')
    }

    // Save report reference
    const { error: reportError } = await supabase
      .from('reports')
      .insert({
        calculation_id: calculationId,
        file_path: filePath
      })

    if (reportError) {
      throw new Error('Failed to save report reference')
    }

    return new Response(
      JSON.stringify({ 
        message: 'Report generated successfully',
        reportUrl: signedUrl
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Report generation error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})