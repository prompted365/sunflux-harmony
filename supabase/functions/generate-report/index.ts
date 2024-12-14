import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { jsPDF } from 'https://esm.sh/jspdf@2.5.1'

interface SolarCalculation {
  id: string;
  status: string;
  system_size: number | null;
  irradiance_data: {
    maxSunshineHours: number;
    carbonOffset: number;
  } | null;
  panel_layout: {
    maxPanels: number;
    maxArea: number;
  } | null;
  estimated_production: {
    yearlyEnergyDcKwh: number;
  } | null;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function calculateFinancialMetrics(calculation: SolarCalculation) {
  const avgElectricityRate = 0.15;
  const annualProduction = calculation.estimated_production?.yearlyEnergyDcKwh || 0;
  const annualSavings = annualProduction * avgElectricityRate;
  const systemCostPerWatt = 2.95;
  const totalSystemCost = (calculation.system_size || 0) * 1000 * systemCostPerWatt;
  const federalTaxCredit = totalSystemCost * 0.30;
  const netSystemCost = totalSystemCost - federalTaxCredit;
  const paybackPeriod = netSystemCost / (annualSavings || 1); // Prevent division by zero

  return {
    totalSystemCost,
    federalTaxCredit,
    netSystemCost,
    annualSavings,
    paybackPeriod
  };
}

function calculateEnvironmentalImpact(calculation: SolarCalculation) {
  const annualProduction = calculation.estimated_production?.yearlyEnergyDcKwh || 0;
  const carbonOffset = ((calculation.irradiance_data?.carbonOffset || 0) * annualProduction) / 1000;
  const treesEquivalent = carbonOffset / 20;

  return {
    carbonOffset,
    treesEquivalent: Math.round(treesEquivalent)
  };
}

function generatePDF(calculation: SolarCalculation, propertyAddress: string) {
  const doc = new jsPDF();
  const financials = calculateFinancialMetrics(calculation);
  const environmental = calculateEnvironmentalImpact(calculation);
  
  // Title
  doc.setFontSize(24);
  doc.text('Solar Installation Report', 105, 20, { align: 'center' });
  
  // Property Information
  doc.setFontSize(14);
  doc.text(`Property Address: ${propertyAddress}`, 20, 40);

  // System Specifications
  doc.setFontSize(18);
  doc.text('System Specifications', 20, 70);

  doc.setFontSize(12);
  doc.text(`System Size: ${calculation.system_size?.toFixed(2) || 'N/A'} kW`, 20, 85);
  doc.text(`Annual Production: ${calculation.estimated_production?.yearlyEnergyDcKwh?.toFixed(2) || 'N/A'} kWh`, 20, 95);
  doc.text(`Number of Panels: ${calculation.panel_layout?.maxPanels || 'N/A'}`, 20, 105);
  doc.text(`Array Area: ${calculation.panel_layout?.maxArea?.toFixed(1) || 'N/A'} m²`, 20, 115);
  doc.text(`Annual Sunshine Hours: ${calculation.irradiance_data?.maxSunshineHours?.toFixed(0) || 'N/A'} hours`, 20, 125);

  // Financial Analysis
  doc.setFontSize(18);
  doc.text('Financial Analysis', 20, 155);
  
  doc.setFontSize(12);
  doc.text(`Estimated System Cost: $${financials.totalSystemCost.toFixed(2)}`, 20, 170);
  doc.text(`Federal Tax Credit (30%): $${financials.federalTaxCredit.toFixed(2)}`, 20, 180);
  doc.text(`Net System Cost: $${financials.netSystemCost.toFixed(2)}`, 20, 190);
  doc.text(`Annual Energy Savings: $${financials.annualSavings.toFixed(2)}`, 20, 200);
  doc.text(`Estimated Payback Period: ${financials.paybackPeriod.toFixed(1)} years`, 20, 210);

  // Environmental Impact
  doc.setFontSize(18);
  doc.text('Environmental Impact', 20, 230);
  
  doc.setFontSize(12);
  doc.text(`Annual CO2 Reduction: ${environmental.carbonOffset.toFixed(2)} metric tons`, 20, 245);
  doc.text(`Equivalent to Planting: ${environmental.treesEquivalent} trees`, 20, 255);

  return doc;
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
      console.error('Failed to fetch calculation:', calcError);
      throw new Error('Failed to fetch calculation data')
    }

    const propertyAddress = `${calculation.properties.address}, ${calculation.properties.city}, ${calculation.properties.state} ${calculation.properties.zip_code}`;
    
    // Generate PDF
    const doc = generatePDF(calculation, propertyAddress);
    const pdfBytes = doc.output('arraybuffer');

    // Generate a unique filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `solar_report_${calculationId}_${timestamp}.pdf`;
    const filePath = `${calculation.properties.user_id}/${fileName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabaseClient
      .storage
      .from('reports')
      .upload(filePath, pdfBytes, {
        contentType: 'application/pdf',
        upsert: false
      });

    if (uploadError) {
      console.error('Failed to upload PDF:', uploadError);
      throw new Error('Failed to upload PDF');
    }

    // Create signed URL for download
    const { data: { signedUrl }, error: urlError } = await supabaseClient
      .storage
      .from('reports')
      .createSignedUrl(filePath, 60 * 60); // 1 hour expiry

    if (urlError) {
      console.error('Failed to generate download URL:', urlError);
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
      console.error('Failed to save report reference:', reportError);
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