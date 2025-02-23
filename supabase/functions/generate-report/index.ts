import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { generateEnhancedReport } from './utils/reportGenerator.ts'
import { jsPDF } from 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm'

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
    
    // Generate PDF using jsPDF
    console.log('Generating PDF')
    const doc = new jsPDF()
    
    // Add logo and title with styling
    doc.setFontSize(24)
    doc.setTextColor(200, 75, 49) // Primary color
    doc.text('SunLink.ai', 105, 20, { align: 'center' })
    doc.setFontSize(18)
    doc.text('Solar Installation Analysis', 105, 35, { align: 'center' })
    
    // Add property info with styling
    doc.setFontSize(12)
    doc.setTextColor(31, 41, 55) // Text gray
    doc.text('Property Details', 20, 55)
    doc.setFont(undefined, 'normal')
    doc.text(propertyAddress, 20, 63)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 71)

    // Add system specifications section
    doc.setFontSize(16)
    doc.setTextColor(200, 75, 49)
    doc.text('System Specifications', 20, 90)
    
    // Create specification rows
    const specs = [
      ['System Size', `${calculation.system_size?.toFixed(2) || 'N/A'} kW`],
      ['Annual Production', `${calculation.estimated_production?.yearlyEnergyDcKwh?.toFixed(2) || 'N/A'} kWh`],
      ['Panel Count', `${calculation.panel_layout?.maxPanels || 'N/A'}`],
      ['Array Area', `${calculation.panel_layout?.maxArea?.toFixed(1) || 'N/A'} m²`],
      ['Annual Sunshine', `${calculation.irradiance_data?.maxSunshineHours?.toFixed(0) || 'N/A'} hours`],
      ['Carbon Offset', `${calculation.irradiance_data?.carbonOffset?.toFixed(2) || 'N/A'} kg/MWh`]
    ]

    // Add specifications table
    let yPos = 100
    specs.forEach(([label, value]) => {
      doc.setFontSize(10)
      doc.setTextColor(31, 41, 55)
      doc.text(label, 25, yPos)
      doc.setTextColor(200, 75, 49)
      doc.text(value, 120, yPos)
      yPos += 10
    })

    // Add financial analysis section if available
    if (calculation.financial_analysis) {
      doc.setFontSize(16)
      doc.setTextColor(200, 75, 49)
      doc.text('Financial Analysis', 20, yPos + 20)
      
      const financials = [
        ['Estimated Annual Savings', `$${(calculation.financial_analysis.annualSavings || 0).toFixed(2)}`],
        ['20-Year Savings', `$${(calculation.financial_analysis.twentyYearSavings || 0).toFixed(2)}`],
        ['Payback Period', `${calculation.financial_analysis.paybackPeriod?.toFixed(1) || 'N/A'} years`]
      ]

      yPos += 30
      financials.forEach(([label, value]) => {
        doc.setFontSize(10)
        doc.setTextColor(31, 41, 55)
        doc.text(label, 25, yPos)
        doc.setTextColor(45, 158, 91) // Success green
        doc.text(value, 120, yPos)
        yPos += 10
      })
    }

    // Add professional footer with branding
    doc.setFontSize(8)
    doc.setTextColor(156, 163, 175) // Gray
    doc.text('Powered by SunLink.ai - Accelerating Solar Adoption Through Innovation', 105, 280, { align: 'center' })

    // Convert PDF to buffer
    const pdfBuffer = doc.output('arraybuffer')

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