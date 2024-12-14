import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { jsPDF } from 'https://esm.sh/jspdf@2.5.1'
import { calculateFinancialMetrics } from './utils/financialCalculations.ts'
import { calculateEnvironmentalImpact } from './utils/environmentalCalculations.ts'
import { calculateSystemSpecs } from './utils/systemSpecifications.ts'

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
    console.log('Starting report generation for calculation:', calculationId)
    
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
      console.error('Failed to fetch calculation:', calcError)
      throw new Error('Failed to fetch calculation data')
    }

    console.log('Calculation data fetched:', calculation)

    const propertyAddress = `${calculation.properties.address}, ${calculation.properties.city}, ${calculation.properties.state} ${calculation.properties.zip_code}`
    
    // Calculate metrics using utility functions with proper error handling
    try {
      const systemSpecs = calculateSystemSpecs(calculation)
      const financialMetrics = calculateFinancialMetrics(calculation, systemSpecs.systemSize)
      const environmentalImpact = calculateEnvironmentalImpact(calculation, systemSpecs.annualProduction)

      // Generate PDF
      const doc = new jsPDF()
      
      // Title
      doc.setFontSize(24)
      doc.text('Solar Installation Report', 105, 20, { align: 'center' })
      
      // Property Information
      doc.setFontSize(12)
      doc.text(`Property Address: ${propertyAddress}`, 20, 40)

      // System Specifications
      doc.setFontSize(18)
      doc.text('System Specifications', 20, 60)
      
      doc.setFontSize(12)
      doc.text([
        `System Size: ${systemSpecs.systemSize.toFixed(2)} kW`,
        `Annual Production: ${systemSpecs.annualProduction.toFixed(2)} kWh`,
        `Number of Panels: ${systemSpecs.panelCount}`,
        `Array Area: ${systemSpecs.arrayArea.toFixed(1)} m²`,
        `Annual Sunshine Hours: ${systemSpecs.sunshineHours.toFixed(0)} hours`,
        `System Efficiency: ${systemSpecs.efficiency.toFixed(1)}%`
      ], 20, 75)

      // Financial Analysis
      doc.setFontSize(18)
      doc.text('Financial Analysis', 20, 120)
      
      doc.setFontSize(12)
      doc.text([
        `Total System Cost: $${financialMetrics.totalSystemCost.toLocaleString(undefined, {minimumFractionDigits: 2})}`,
        `Federal Tax Credit: $${financialMetrics.federalTaxCredit.toLocaleString(undefined, {minimumFractionDigits: 2})}`,
        `Net System Cost: $${financialMetrics.netSystemCost.toLocaleString(undefined, {minimumFractionDigits: 2})}`,
        `Monthly Bill Savings: $${financialMetrics.monthlyBillSavings.toLocaleString(undefined, {minimumFractionDigits: 2})}`,
        `Annual Energy Savings: $${financialMetrics.annualSavings.toLocaleString(undefined, {minimumFractionDigits: 2})}`,
        `20-Year Total Savings: $${financialMetrics.twentyYearSavings.toLocaleString(undefined, {minimumFractionDigits: 2})}`,
        `Payback Period: ${financialMetrics.paybackPeriod.toFixed(1)} years`
      ], 20, 135)

      // Environmental Impact
      doc.setFontSize(18)
      doc.text('Environmental Impact', 20, 190)
      
      doc.setFontSize(12)
      doc.text([
        `CO₂ Reduction: ${environmentalImpact.carbonOffset.toFixed(2)} metric tons per year`,
        `Equivalent to Planting: ${environmentalImpact.treesEquivalent.toLocaleString()} trees`,
        `Powers Equivalent of: ${environmentalImpact.homesEquivalent} average homes`,
        `Gasoline Saved: ${environmentalImpact.gasSaved.toLocaleString()} gallons per year`
      ], 20, 205)

      const pdfBytes = doc.output('arraybuffer')
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const fileName = `solar_report_${calculationId}_${timestamp}.pdf`
      const filePath = `reports/${fileName}`

      console.log('Uploading PDF to storage:', filePath)

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase
        .storage
        .from('reports')
        .upload(filePath, pdfBytes, {
          contentType: 'application/pdf',
          upsert: false
        })

      if (uploadError) {
        console.error('Failed to upload PDF:', uploadError)
        throw new Error('Failed to upload PDF')
      }

      // Create signed URL for download
      const { data: { signedUrl }, error: urlError } = await supabase
        .storage
        .from('reports')
        .createSignedUrl(filePath, 60 * 60) // 1 hour expiry

      if (urlError) {
        console.error('Failed to generate download URL:', urlError)
        throw new Error('Failed to generate download URL')
      }

      // Save report reference in database
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

      console.log('Report generated successfully')

      return new Response(
        JSON.stringify({ 
          message: 'Report generated successfully',
          downloadUrl: signedUrl
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json'
          },
          status: 200 
        }
      )

    } catch (error) {
      console.error('Error during report generation:', error)
      throw error
    }

  } catch (error) {
    console.error('Report generation error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        details: error
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})