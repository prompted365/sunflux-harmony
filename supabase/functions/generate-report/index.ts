import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'
import * as pdf from 'https://deno.land/x/pdfkit@v0.3.0/mod.ts'

interface SolarCalculation {
  id: string;
  status: string;
  system_size: number;
  irradiance_data: {
    maxSunshineHours: number;
    carbonOffset: number;
  };
  panel_layout: {
    maxPanels: number;
    maxArea: number;
  };
  estimated_production: {
    yearlyEnergyDcKwh: number;
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { calculationId } = await req.json()
    
    if (!calculationId) {
      throw new Error('Calculation ID is required')
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch calculation data
    const { data: calculation, error: calcError } = await supabaseClient
      .from('solar_calculations')
      .select(`
        id,
        status,
        system_size,
        irradiance_data,
        panel_layout,
        estimated_production,
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

    // Generate PDF content
    const doc = new pdf.default()
    const chunks: Uint8Array[] = []

    doc.on('data', (chunk: Uint8Array) => chunks.push(chunk))

    // Add content to PDF
    doc
      .fontSize(24)
      .text('Solar Installation Report', { align: 'center' })
      .moveDown()
      
    doc
      .fontSize(14)
      .text(`Property Address: ${calculation.properties.address}`)
      .text(`${calculation.properties.city}, ${calculation.properties.state} ${calculation.properties.zip_code}`)
      .moveDown()

    doc
      .fontSize(18)
      .text('System Specifications')
      .moveDown()

    doc
      .fontSize(12)
      .text(`System Size: ${calculation.system_size.toFixed(2)} kW`)
      .text(`Annual Production: ${calculation.estimated_production.yearlyEnergyDcKwh.toFixed(2)} kWh`)
      .text(`Number of Panels: ${calculation.panel_layout.maxPanels}`)
      .text(`Array Area: ${calculation.panel_layout.maxArea.toFixed(1)} m²`)
      .text(`Annual Sunshine Hours: ${calculation.irradiance_data.maxSunshineHours.toFixed(0)} hours`)
      .text(`Carbon Offset: ${calculation.irradiance_data.carbonOffset.toFixed(2)} kg/MWh`)
      .moveDown()

    // Calculate and add financial metrics
    const avgElectricityRate = 0.15 // $0.15 per kWh (average US rate)
    const annualProduction = calculation.estimated_production.yearlyEnergyDcKwh
    const annualSavings = annualProduction * avgElectricityRate
    const systemCostPerWatt = 2.95 // Average cost per watt installed
    const totalSystemCost = calculation.system_size * 1000 * systemCostPerWatt
    const federalTaxCredit = totalSystemCost * 0.30 // 30% federal tax credit
    const netSystemCost = totalSystemCost - federalTaxCredit
    const paybackPeriod = netSystemCost / annualSavings

    doc
      .fontSize(18)
      .text('Financial Analysis')
      .moveDown()
      
    doc
      .fontSize(12)
      .text(`Estimated System Cost: $${totalSystemCost.toFixed(2)}`)
      .text(`Federal Tax Credit (30%): $${federalTaxCredit.toFixed(2)}`)
      .text(`Net System Cost: $${netSystemCost.toFixed(2)}`)
      .text(`Annual Energy Savings: $${annualSavings.toFixed(2)}`)
      .text(`Estimated Payback Period: ${paybackPeriod.toFixed(1)} years`)
      .moveDown()

    // Add environmental impact
    const treesEquivalent = (calculation.irradiance_data.carbonOffset * annualProduction / 1000) / 20 // Average tree absorbs 20kg CO2 per year

    doc
      .fontSize(18)
      .text('Environmental Impact')
      .moveDown()
      
    doc
      .fontSize(12)
      .text(`Annual CO2 Reduction: ${(calculation.irradiance_data.carbonOffset * annualProduction / 1000).toFixed(2)} metric tons`)
      .text(`Equivalent to Planting: ${Math.round(treesEquivalent)} trees`)
      .moveDown()

    // Finalize the PDF
    doc.end()

    // Combine chunks into a single Uint8Array
    const pdfBytes = new Uint8Array(chunks.reduce((acc, chunk) => [...acc, ...chunk], []))

    // Generate a unique filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const fileName = `${calculation.id}_${timestamp}.pdf`
    const filePath = `${fileName}`

    // Upload to Supabase Storage
    const { error: uploadError } = await supabaseClient
      .storage
      .from('reports')
      .upload(filePath, pdfBytes, {
        contentType: 'application/pdf',
        upsert: false
      })

    if (uploadError) {
      throw new Error('Failed to upload PDF')
    }

    // Create signed URL for download
    const { data: { signedUrl }, error: urlError } = await supabaseClient
      .storage
      .from('reports')
      .createSignedUrl(filePath, 60 * 60) // 1 hour expiry

    if (urlError) {
      throw new Error('Failed to generate download URL')
    }

    // Save report reference in database
    const { error: reportError } = await supabaseClient
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
        downloadUrl: signedUrl
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
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