import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { geocodeAddress } from './utils/geocoding.ts';
import { fetchSolarData, processSolarData } from './utils/solarApi.ts';
import { downloadAndProcessImage } from './utils/imageProcessing.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { propertyId } = await req.json();
    
    if (!propertyId) {
      throw new Error('Property ID is required');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get property details
    const { data: property, error: propertyError } = await supabaseClient
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single();

    if (propertyError || !property) {
      throw new Error('Failed to fetch property details');
    }

    // If we don't have coordinates, geocode the address
    if (!property.latitude || !property.longitude) {
      console.log('Geocoding address:', property.address);
      const coordinates = await geocodeAddress(
        property.address,
        property.city,
        property.state,
        property.zip_code
      );

      if (!coordinates) {
        throw new Error('Failed to geocode address');
      }

      // Update property with coordinates
      const { error: updateError } = await supabaseClient
        .from('properties')
        .update({
          latitude: coordinates.lat,
          longitude: coordinates.lng
        })
        .eq('id', propertyId);

      if (updateError) {
        throw updateError;
      }

      property.latitude = coordinates.lat;
      property.longitude = coordinates.lng;
    }

    // Fetch solar data from Google Solar API
    const solarData = await fetchSolarData(property.latitude, property.longitude);
    
    // Download and store imagery
    const imageryUrls = await processAndStoreImagery(solarData, propertyId, supabaseClient);
    
    // Process the solar data with imagery URLs
    const processedData = {
      ...processSolarData(solarData),
      building_specs: {
        ...processSolarData(solarData).building_specs,
        imagery: imageryUrls
      }
    };

    // Update solar calculation with processed data
    const { error: updateError } = await supabaseClient
      .from('solar_calculations')
      .update(processedData)
      .eq('id', calculation.id);

    if (updateError) {
      throw updateError;
    }

    return new Response(
      JSON.stringify({ message: 'Solar calculation completed successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Solar calculation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});

async function processAndStoreImagery(solarData: any, propertyId: string, supabase: any) {
  const imageryUrls = {
    dsm: null,
    rgb: null,
    mask: null,
    annualFlux: null,
    monthlyFlux: null
  };

  try {
    // Process each image type
    const imageTypes = {
      dsm: solarData.dsmUrl,
      rgb: solarData.rgbUrl,
      mask: solarData.maskUrl,
      annualFlux: solarData.annualFluxUrl,
      monthlyFlux: solarData.monthlyFluxUrl
    };

    for (const [type, url] of Object.entries(imageTypes)) {
      if (url) {
        const imageData = await downloadAndProcessImage(url, Deno.env.get('GOOGLE_CLOUD_API_KEY') ?? '');
        if (imageData) {
          const filePath = `${propertyId}/${type}.png`;
          const { error: uploadError } = await supabase.storage
            .from('solar_imagery')
            .upload(filePath, imageData, {
              contentType: 'image/png',
              upsert: true
            });

          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
              .from('solar_imagery')
              .getPublicUrl(filePath);
            
            imageryUrls[type as keyof typeof imageryUrls] = publicUrl;
          }
        }
      }
    }
  } catch (error) {
    console.error('Error processing imagery:', error);
  }

  return imageryUrls;
}