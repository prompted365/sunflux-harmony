import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from "../_shared/cors.ts"

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const GOOGLE_CLOUD_API_KEY = Deno.env.get('GOOGLE_CLOUD_API_KEY')!;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Parse request body
    const { calculationId, latitude, longitude } = await req.json();

    // Validate required parameters
    if (!calculationId) {
      throw new Error('calculationId is required');
    }
    if (!latitude || typeof latitude !== 'number') {
      throw new Error('latitude is required and must be a number');
    }
    if (!longitude || typeof longitude !== 'number') {
      throw new Error('longitude is required and must be a number');
    }

    console.log('Processing solar imagery for:', { calculationId, latitude, longitude });

    // 1. Fetch data layers from Google Solar API
    const dataLayersUrl = `https://solar.googleapis.com/v1/dataLayers:get?location.latitude=${latitude}&location.longitude=${longitude}&radiusMeters=100&view=FULL_LAYERS&key=${GOOGLE_CLOUD_API_KEY}`;
    
    const dataLayersResponse = await fetch(dataLayersUrl);
    if (!dataLayersResponse.ok) {
      const errorText = await dataLayersResponse.text();
      console.error('Failed to fetch data layers:', errorText);
      throw new Error(`Failed to fetch data layers: ${errorText}`);
    }

    const dataLayers = await dataLayersResponse.json();
    console.log('Successfully fetched data layers');

    // 2. Store data layers information
    const { error: dataLayersError } = await supabase
      .from('data_layers')
      .insert({
        calculation_id: calculationId,
        imagery_date: dataLayers.imageryDate,
        imagery_processed_date: dataLayers.imageryProcessedDate,
        dsm_url: dataLayers.dsmUrl,
        rgb_url: dataLayers.rgbUrl,
        mask_url: dataLayers.maskUrl,
        annual_flux_url: dataLayers.annualFluxUrl,
        monthly_flux_url: dataLayers.monthlyFluxUrl,
        hourly_shade_urls: dataLayers.hourlyShadeUrls,
        imagery_quality: dataLayers.imageryQuality,
        raw_response: dataLayers,
        processed_at: new Date().toISOString()
      });

    if (dataLayersError) {
      console.error('Failed to store data layers:', dataLayersError);
      throw new Error(`Failed to store data layers: ${dataLayersError.message}`);
    }

    console.log('Successfully stored data layers');

    // 3. Update solar calculation status
    const { error: updateError } = await supabase
      .from('solar_calculations')
      .update({ 
        status: 'completed',
        building_specs: {
          imagery: {
            dsm: dataLayers.dsmUrl,
            rgb: dataLayers.rgbUrl,
            mask: dataLayers.maskUrl,
            annualFlux: dataLayers.annualFluxUrl,
            monthlyFlux: dataLayers.monthlyFluxUrl
          }
        }
      })
      .eq('id', calculationId);

    if (updateError) {
      console.error('Failed to update calculation:', updateError);
      throw new Error(`Failed to update calculation: ${updateError.message}`);
    }

    console.log('Successfully updated calculation status');

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing solar imagery:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});