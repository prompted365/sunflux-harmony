import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from "../_shared/cors.ts"

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const GOOGLE_CLOUD_API_KEY = Deno.env.get('GOOGLE_CLOUD_API_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { calculationId, latitude, longitude } = await req.json();
    
    if (!calculationId || !latitude || !longitude) {
      throw new Error('Missing required parameters');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1. Fetch building insights
    console.log('Fetching building insights...');
    const buildingInsightsUrl = `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${latitude}&location.longitude=${longitude}&key=${GOOGLE_CLOUD_API_KEY}`;
    
    const buildingResponse = await fetch(buildingInsightsUrl);
    if (!buildingResponse.ok) {
      throw new Error(`Failed to fetch building insights: ${await buildingResponse.text()}`);
    }
    
    const buildingData = await buildingResponse.json();

    // 2. Fetch data layers
    console.log('Fetching data layers...');
    const dataLayersUrl = `https://solar.googleapis.com/v1/dataLayers:get?location.latitude=${latitude}&location.longitude=${longitude}&radiusMeters=100&view=FULL_LAYERS&key=${GOOGLE_CLOUD_API_KEY}`;
    
    const dataLayersResponse = await fetch(dataLayersUrl);
    if (!dataLayersResponse.ok) {
      throw new Error(`Failed to fetch data layers: ${await dataLayersResponse.text()}`);
    }
    
    const dataLayersData = await dataLayersResponse.json();

    // 3. Store data layers information
    const { error: dataLayersError } = await supabase
      .from('data_layers')
      .insert({
        calculation_id: calculationId,
        imagery_date: dataLayersData.imageryDate,
        imagery_processed_date: dataLayersData.imageryProcessedDate,
        dsm_url: dataLayersData.dsmUrl,
        rgb_url: dataLayersData.rgbUrl,
        mask_url: dataLayersData.maskUrl,
        annual_flux_url: dataLayersData.annualFluxUrl,
        monthly_flux_url: dataLayersData.monthlyFluxUrl,
        hourly_shade_urls: dataLayersData.hourlyShadeUrls,
        imagery_quality: dataLayersData.imageryQuality,
        raw_response: dataLayersData
      });

    if (dataLayersError) {
      throw new Error(`Failed to store data layers: ${dataLayersError.message}`);
    }

    // 4. Update solar calculation with building insights data
    const { error: updateError } = await supabase
      .from('solar_calculations')
      .update({
        status: 'completed',
        system_size: buildingData.solarPotential?.maxArrayPanelsCount || null,
        panel_layout: buildingData.solarPotential?.panelLayout || null,
        estimated_production: buildingData.solarPotential?.estimatedProduction || null,
        financial_analysis: buildingData.solarPotential?.financialAnalyses || null,
        building_specs: {
          address: buildingData.name,
          imagery: dataLayersData
        }
      })
      .eq('id', calculationId);

    if (updateError) {
      throw new Error(`Failed to update calculation: ${updateError.message}`);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});