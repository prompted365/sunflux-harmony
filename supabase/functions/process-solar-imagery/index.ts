import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { downloadAndProcessImage } from "./utils/imageProcessing.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { calculationId, latitude, longitude } = await req.json();

    if (!calculationId || !latitude || !longitude) {
      throw new Error('Missing required parameters');
    }

    console.log('Processing imagery for calculation:', calculationId);

    // Get the Google Cloud API key from environment variables
    const apiKey = Deno.env.get('GOOGLE_CLOUD_API_KEY');
    if (!apiKey) {
      throw new Error('Google Cloud API key not found');
    }

    // Get data layers for this location
    const solarAPI = `https://solar.googleapis.com/v1/dataLayers:get?location.latitude=${latitude}&location.longitude=${longitude}&radiusMeters=100&view=FULL_LAYERS&key=${apiKey}`;
    
    const response = await fetch(solarAPI);
    if (!response.ok) {
      throw new Error(`Failed to fetch data layers: ${response.statusText}`);
    }

    const dataLayers = await response.json();
    console.log('Received data layers:', dataLayers);

    // Process and store each image type
    const processedImages = {
      rgb: dataLayers.rgbUrl ? await processAndStoreImage(dataLayers.rgbUrl, 'rgb', calculationId, supabase) : null,
      dsm: dataLayers.dsmUrl ? await processAndStoreImage(dataLayers.dsmUrl, 'dsm', calculationId, supabase) : null,
      mask: dataLayers.maskUrl ? await processAndStoreImage(dataLayers.maskUrl, 'mask', calculationId, supabase) : null,
      annualFlux: dataLayers.annualFluxUrl ? await processAndStoreImage(dataLayers.annualFluxUrl, 'annual-flux', calculationId, supabase) : null,
      monthlyFlux: dataLayers.monthlyFluxUrl ? await processAndStoreImage(dataLayers.monthlyFluxUrl, 'monthly-flux', calculationId, supabase) : null,
    };

    console.log('Images processed:', processedImages);

    // Store the data layers information
    const { error: insertError } = await supabase
      .from('data_layers')
      .insert({
        calculation_id: calculationId,
        imagery_date: dataLayers.imageryDate,
        imagery_processed_date: dataLayers.imageryProcessedDate,
        dsm_url: processedImages.dsm,
        rgb_url: processedImages.rgb,
        mask_url: processedImages.mask,
        annual_flux_url: processedImages.annualFlux,
        monthly_flux_url: processedImages.monthlyFlux,
        imagery_quality: dataLayers.imageryQuality,
        raw_response: dataLayers
      });

    if (insertError) {
      throw insertError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Imagery processed successfully',
        imagery: processedImages 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );

  } catch (error) {
    console.error('Error processing solar imagery:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 400
      }
    );
  }
});

async function processAndStoreImage(
  url: string,
  type: string,
  calculationId: string,
  supabase: any
): Promise<string | null> {
  try {
    const apiKey = Deno.env.get('GOOGLE_CLOUD_API_KEY');
    if (!apiKey) {
      throw new Error('Google Cloud API key not found');
    }

    // Download and process the image
    const base64Data = await downloadAndProcessImage(url, apiKey);
    if (!base64Data) {
      console.warn(`No data returned for ${type} image`);
      return null;
    }

    // Convert base64 to Uint8Array for storage
    const binaryData = Uint8Array.from(atob(base64Data.split(',')[1]), c => c.charCodeAt(0));

    // Generate a unique filename
    const filename = `${calculationId}/${type}.png`;

    // Store the processed image
    const { error: uploadError } = await supabase
      .storage
      .from('solar_imagery')
      .upload(filename, binaryData, {
        contentType: 'image/png',
        upsert: true
      });

    if (uploadError) {
      console.error(`Error uploading ${type} image:`, uploadError);
      return null;
    }

    return filename;
  } catch (error) {
    console.error(`Error processing ${type} image:`, error);
    return null;
  }
}