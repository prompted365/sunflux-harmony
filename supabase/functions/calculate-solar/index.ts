import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { geocodeAddress } from './utils/geocoding.ts';
import { fetchSolarData, processSolarData } from './utils/solarApi.ts';

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

    // Create solar calculation record
    const { data: calculation, error: calculationError } = await supabaseClient
      .from('solar_calculations')
      .insert({
        property_id: propertyId,
        status: 'pending'
      })
      .select()
      .single();

    if (calculationError || !calculation) {
      throw new Error('Failed to create solar calculation record');
    }

    // Fetch solar data from Google Solar API
    const solarData = await fetchSolarData(property.latitude, property.longitude);
    
    // Process the solar data
    const processedData = processSolarData(solarData);

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