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
    console.log('Generating report for calculation:', calculationId);
    
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
          address,
          city,
          state,
          zip_code,
          latitude,
          longitude
        )
      `)
      .eq('id', calculationId)
      .single();

    if (calcError || !calculation) {
      console.error('Failed to fetch calculation:', calcError);
      throw new Error('Failed to fetch calculation data');
    }

    console.log('Calculation data fetched:', calculation);

    // Fetch RGB image data from Google Solar API
    const apiKey = Deno.env.get('GOOGLE_CLOUD_API_KEY');
    if (!apiKey) {
      throw new Error('Google Cloud API key not found');
    }

    const location = {
      latitude: calculation.properties.latitude,
      longitude: calculation.properties.longitude
    };

    // Fetch data layers for visualization
    const dataLayersResponse = await fetch(
      `https://solar.googleapis.com/v1/dataLayers:get?` +
      `location.latitude=${location.latitude}&` +
      `location.longitude=${location.longitude}&` +
      `radius_meters=100&` +
      `required_quality=LOW&` +
      `key=${apiKey}`
    );

    const dataLayers = await dataLayersResponse.json();
    console.log('Data layers fetched:', dataLayers);

    // Get RGB image for visualization
    let rgbImageBase64 = '';
    if (dataLayers.rgbUrl) {
      const rgbResponse = await fetch(`${dataLayers.rgbUrl}&key=${apiKey}`);
      const rgbBuffer = await rgbResponse.arrayBuffer();
      rgbImageBase64 = btoa(String.fromCharCode(...new Uint8Array(rgbBuffer)));
    }

    const propertyAddress = `${calculation.properties.address}, ${calculation.properties.city}, ${calculation.properties.state} ${calculation.properties.zip_code}`;
    
    // Calculate metrics
    const annualProduction = calculation.estimated_production?.yearlyEnergyDcKwh || 0;
    const carbonOffsetRate = calculation.irradiance_data?.carbonOffset || 0;

    const financialMetrics = calculateFinancialMetrics(
      calculation.system_size || 0,
      annualProduction
    );

    const environmentalImpact = calculateEnvironmentalImpact(
      annualProduction,
      carbonOffsetRate
    );

    // System specifications
    const systemSpecs = {
      systemSize: calculation.system_size || 0,
      annualProduction: calculation.estimated_production?.yearlyEnergyDcKwh || 0,
      panelCount: calculation.panel_layout?.maxPanels || 0,
      arrayArea: calculation.panel_layout?.maxArea || 0,
      sunshineHours: calculation.irradiance_data?.maxSunshineHours || 0,
      efficiency: calculation.system_size ? (annualProduction / (calculation.system_size * 1000)) * 100 : 0
    };

    console.log('Generating PDF with specs:', systemSpecs);

    // Generate PDF
    const pdfBytes = await generatePDF(
      propertyAddress,
      systemSpecs,
      financialMetrics,
      environmentalImpact,
      rgbImageBase64
    );

    // Generate a unique filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `solar_report_${calculationId}_${timestamp}.pdf`;
    const filePath = `reports/${fileName}`;

    console.log('Uploading PDF to storage:', filePath);

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

    console.log('Report generated successfully');

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