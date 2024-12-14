import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'
import { jsPDF } from 'https://esm.sh/jspdf@2.5.1'

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

    // Generate PDF
    const doc = new jsPDF();
    
    // Add content to PDF
    doc.setFontSize(24);
    doc.text('Solar Installation Report', 105, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.text(`Property Address: ${calculation.properties.address}`, 20, 40);
    doc.text(`${calculation.properties.city}, ${calculation.properties.state} ${calculation.properties.zip_code}`, 20, 50);

    doc.setFontSize(18);
    doc.text('System Specifications', 20, 70);

    doc.setFontSize(12);
    doc.text(`System Size: ${calculation.system_size.toFixed(2)} kW`, 20, 85);
    doc.text(`Annual Production: ${calculation.estimated_production.yearlyEnergyDcKwh.toFixed(2)} kWh`, 20, 95);
    doc.text(`Number of Panels: ${calculation.panel_layout.maxPanels}`, 20, 105);
    doc.text(`Array Area: ${calculation.panel_layout.maxArea.toFixed(1)} m²`, 20, 115);
    doc.text(`Annual Sunshine Hours: ${calculation.irradiance_data.maxSunshineHours.toFixed(0)} hours`, 20, 125);
    doc.text(`Carbon Offset: ${calculation.irradiance_data.carbonOffset.toFixed(2)} kg/MWh`, 20, 135);

    // Calculate and add financial metrics
    const avgElectricityRate = 0.15; // $0.15 per kWh (average US rate)
    const annualProduction = calculation.estimated_production.yearlyEnergyDcKwh;
    const annualSavings = annualProduction * avgElectricityRate;
    const systemCostPerWatt = 2.95; // Average cost per watt installed
    const totalSystemCost = calculation.system_size * 1000 * systemCostPerWatt;
    const federalTaxCredit = totalSystemCost * 0.30; // 30% federal tax credit
    const netSystemCost = totalSystemCost - federalTaxCredit;
    const paybackPeriod = netSystemCost / annualSavings;

    doc.setFontSize(18);
    doc.text('Financial Analysis', 20, 155);
    
    doc.setFontSize(12);
    doc.text(`Estimated System Cost: $${totalSystemCost.toFixed(2)}`, 20, 170);
    doc.text(`Federal Tax Credit (30%): $${federalTaxCredit.toFixed(2)}`, 20, 180);
    doc.text(`Net System Cost: $${netSystemCost.toFixed(2)}`, 20, 190);
    doc.text(`Annual Energy Savings: $${annualSavings.toFixed(2)}`, 20, 200);
    doc.text(`Estimated Payback Period: ${paybackPeriod.toFixed(1)} years`, 20, 210);

    // Add environmental impact
    const treesEquivalent = (calculation.irradiance_data.carbonOffset * annualProduction / 1000) / 20; // Average tree absorbs 20kg CO2 per year

    doc.setFontSize(18);
    doc.text('Environmental Impact', 20, 230);
    
    doc.setFontSize(12);
    doc.text(`Annual CO2 Reduction: ${(calculation.irradiance_data.carbonOffset * annualProduction / 1000).toFixed(2)} metric tons`, 20, 245);
    doc.text(`Equivalent to Planting: ${Math.round(treesEquivalent)} trees`, 20, 255);

    // Convert PDF to bytes
    const pdfBytes = doc.output('arraybuffer');

    // Generate a unique filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `solar_report_${calculationId}_${timestamp}.pdf`;
    const filePath = fileName;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabaseClient
      .storage
      .from('reports')
      .upload(filePath, pdfBytes, {
        contentType: 'application/pdf',
        upsert: false
      });

    if (uploadError) {
      throw new Error('Failed to upload PDF');
    }

    // Create signed URL for download
    const { data: { signedUrl }, error: urlError } = await supabaseClient
      .storage
      .from('reports')
      .createSignedUrl(filePath, 60 * 60); // 1 hour expiry

    if (urlError) {
      throw new Error('Failed to generate download URL');
    }

    // Save report reference in database
    const { error: reportError } = await supabaseClient
      .from('reports')
      .insert({
        calculation_id: calculationId,
        file_path: filePath
      });

    if (reportError) {
      throw new Error('Failed to save report reference');
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
    );

  } catch (error) {
    console.error('Report generation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});