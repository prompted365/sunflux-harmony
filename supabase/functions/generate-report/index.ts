import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { calculateFinancialMetrics } from './utils/financialCalculations.ts';
import { calculateEnvironmentalImpact } from './utils/environmentalCalculations.ts';
import { generatePDF } from './utils/pdfGenerator.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { calculationId } = await req.json();
    
    if (!calculationId) {
      throw new Error('Calculation ID is required');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch calculation data with property information
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
          id,
          user_id,
          address,
          city,
          state,
          zip_code
        )
      `)
      .eq('id', calculationId)
      .single();

    if (calcError || !calculation) {
      console.error('Failed to fetch calculation:', calcError);
      throw new Error('Failed to fetch calculation data');
    }

    const propertyAddress = `${calculation.properties.address}, ${calculation.properties.city}, ${calculation.properties.state} ${calculation.properties.zip_code}`;
    
    // Calculate metrics
    const annualProduction = calculation.estimated_production?.yearlyEnergyDcKwh || 0;
    const carbonOffsetRate = calculation.irradiance_data?.carbonOffset || 0;

    const financialMetrics = calculateFinancialMetrics(
      calculation.system_size,
      annualProduction
    );

    const environmentalImpact = calculateEnvironmentalImpact(
      annualProduction,
      carbonOffsetRate
    );

    // System specifications
    const systemSpecs = {
      systemSize: calculation.system_size,
      annualProduction: calculation.estimated_production?.yearlyEnergyDcKwh || null,
      panelCount: calculation.panel_layout?.maxPanels || null,
      arrayArea: calculation.panel_layout?.maxArea || null,
      sunshineHours: calculation.irradiance_data?.maxSunshineHours || null,
      efficiency: calculation.system_size ? (annualProduction / (calculation.system_size * 1000)) * 100 : null
    };

    // Generate PDF
    const pdfBytes = generatePDF(
      propertyAddress,
      systemSpecs,
      financialMetrics,
      environmentalImpact
    );

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