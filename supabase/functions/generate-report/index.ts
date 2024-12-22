import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { generateReport } from './utils/reportGenerator.ts'
import { jsPDF } from 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm'

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
    
    // Transform calculation data for the report
    const reportData = {
      propertyAddress,
      systemSize: calculation.system_size || 0,
      annualProduction: calculation.estimated_production?.yearlyEnergyDcKwh || 0,
      initialInvestment: calculation.financial_analysis?.initialCost || 0,
      federalTaxCredit: calculation.financial_analysis?.federalIncentive || 0,
      monthlySavings: calculation.financial_analysis?.monthlyBillSavings || 0,
      carbonOffset: calculation.estimated_production?.environmentalImpact?.carbonOffset || 0,
      treesEquivalent: Math.round((calculation.estimated_production?.environmentalImpact?.carbonOffset || 0) * 20 / 21.7)
    }

    // Generate HTML report
    console.log('Generating HTML report')
    const htmlContent = generateReport(reportData)

    // Convert to PDF
    console.log('Converting to PDF')
    const doc = new jsPDF()
    
    // Basic PDF generation - this should be enhanced
    doc.html(htmlContent, {
      callback: function (doc) {
        // Save PDF to storage
        const pdfBuffer = doc.output('arraybuffer')
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

        // Create signed URL
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
      },
      x: 10,
      y: 10
    })

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