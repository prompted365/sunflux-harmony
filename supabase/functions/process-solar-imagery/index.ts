import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

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

    // Format dates properly for PostgreSQL
    const formatDate = (dateObj: any) => {
      if (!dateObj) return null;
      return `${dateObj.year}-${String(dateObj.month).padStart(2, '0')}-${String(dateObj.day).padStart(2, '0')}`;
    };

    // Process and store each image type
    const processedImages = {
      dsm: dataLayers.dsmUrl ? await processAndStoreImage(dataLayers.dsmUrl, 'dsm', calculationId, supabase, apiKey) : null,
      rgb: dataLayers.rgbUrl ? await processAndStoreImage(dataLayers.rgbUrl, 'rgb', calculationId, supabase, apiKey) : null,
      mask: dataLayers.maskUrl ? await processAndStoreImage(dataLayers.maskUrl, 'mask', calculationId, supabase, apiKey) : null,
      annualFlux: dataLayers.annualFluxUrl ? await processAndStoreImage(dataLayers.annualFluxUrl, 'annual-flux', calculationId, supabase, apiKey) : null,
      monthlyFlux: dataLayers.monthlyFluxUrl ? await processAndStoreImage(dataLayers.monthlyFluxUrl, 'monthly-flux', calculationId, supabase, apiKey) : null,
    };

    console.log('Images processed:', processedImages);

    // Store the data layers information
    const { error: insertError } = await supabase
      .from('data_layers')
      .insert({
        calculation_id: calculationId,
        imagery_date: formatDate(dataLayers.imageryDate),
        imagery_processed_date: formatDate(dataLayers.imageryProcessedDate),
        dsm_url: processedImages.dsm,
        rgb_url: processedImages.rgb,
        mask_url: processedImages.mask,
        annual_flux_url: processedImages.annualFlux,
        monthly_flux_url: processedImages.monthlyFlux,
        imagery_quality: dataLayers.imageryQuality,
        raw_response: dataLayers
      });

    if (insertError) {
      console.error('Error inserting data layers:', insertError);
      throw insertError;
    }

    // Update the calculation status to completed
    const { error: updateError } = await supabase
      .from('solar_calculations')
      .update({ 
        status: 'completed', 
        updated_at: new Date().toISOString(),
        building_specs: {
          imagery: {
            rgb: processedImages.rgb,
            dsm: processedImages.dsm,
            mask: processedImages.mask,
            annualFlux: processedImages.annualFlux,
            monthlyFlux: processedImages.monthlyFlux
          }
        }
      })
      .eq('id', calculationId);

    if (updateError) {
      console.error('Error updating calculation status:', updateError);
      throw updateError;
    }

    console.log('Successfully updated calculation status to completed');

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
  supabase: any,
  apiKey: string
): Promise<string | null> {
  try {
    // Add API key to the URL if it's a Google Solar API URL
    const solarUrl = url.includes('solar.googleapis.com') ? `${url}&key=${apiKey}` : url;
    const response = await fetch(solarUrl);
    
    if (!response.ok) {
      console.error(`Failed to download ${type} image:`, await response.json());
      return null;
    }

    // Convert response to binary data
    const binaryData = await response.arrayBuffer();

    // Generate a unique filename
    const filename = `${calculationId}/${type}.png`;

    // Store the processed image
    const { error: uploadError } = await supabase
      .storage
      .from('solar_imagery')
      .upload(filename, new Uint8Array(binaryData), {
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