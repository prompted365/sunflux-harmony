import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { generateEnhancedReport } from './utils/reportGenerator.ts'
import puppeteer from 'https://deno.land/x/puppeteer@16.2.0/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { calculationId } = await req.json()
    
    if (!calculationId) {
      throw new Error('Calculation ID is required')
    }

    console.log('Generating report for calculation:', calculationId)

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
      console.error('Failed to fetch calculation:', calcError)
      throw new Error('Failed to fetch calculation data')
    }

    const propertyAddress = `${calculation.properties.address}, ${calculation.properties.city}, ${calculation.properties.state} ${calculation.properties.zip_code}`
    
    // Generate HTML report content
    console.log('Generating HTML content')
    const htmlContent = await generateEnhancedReport(calculation, propertyAddress)

    // Launch headless browser
    console.log('Launching browser for PDF generation')
    const browser = await puppeteer.launch({ 
      args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    })
    const page = await browser.newPage()
    
    // Set content and wait for network idle to ensure all resources are loaded
    await page.setContent(htmlContent, { 
      waitUntil: 'networkidle0',
      timeout: 30000 // 30 second timeout
    })
    
    // Generate PDF
    console.log('Generating PDF')
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    })

    await browser.close()

    // Store the PDF report
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const fileName = `report_${calculationId}_${timestamp}.pdf`
    const filePath = `reports/${fileName}`

    console.log('Uploading PDF to storage')
    const { error: uploadError } = await supabase
      .storage
      .from('reports')
      .upload(filePath, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: false
      })

    if (uploadError) {
      console.error('Failed to upload PDF:', uploadError)
      throw new Error('Failed to upload PDF report')
    }

    // Create signed URL for viewing
    console.log('Generating signed URL')
    const { data: { signedUrl }, error: urlError } = await supabase
      .storage
      .from('reports')
      .createSignedUrl(filePath, 60 * 60 * 24 * 7) // 7 days

    if (urlError) {
      console.error('Failed to generate URL:', urlError)
      throw new Error('Failed to generate report URL')
    }

    // Save report reference
    console.log('Saving report reference')
    const { error: reportError } = await supabase
      .from('reports')
      .insert({
        calculation_id: calculationId,
        file_path: filePath
      })

    if (reportError) {
      console.error('Failed to save report reference:', reportError)
      throw new Error('Failed to save report reference')
    }

    console.log('Report generation completed successfully')
    return new Response(
      JSON.stringify({ 
        message: 'PDF Report generated successfully',
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
        status: 500
      }
    )
  }
})