import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function geocodeAddress(address: string, city: string, state: string, zipCode: string): Promise<{lat: number, lng: number} | null> {
  const apiKey = Deno.env.get('GOOGLE_CLOUD_API_KEY');
  if (!apiKey) {
    throw new Error('Google Cloud API key not configured');
  }

  const fullAddress = `${address}, ${city}, ${state} ${zipCode}`;
  const encodedAddress = encodeURIComponent(fullAddress);
  
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`
    );
    
    const data = await response.json();
    
    if (data.status === 'OK' && data.results && data.results[0]) {
      const location = data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng
      };
    }
    
    console.error('Geocoding failed:', data);
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

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

    // Call Google Solar API
    const apiKey = Deno.env.get('GOOGLE_CLOUD_API_KEY');
    if (!apiKey) {
      throw new Error('Google Cloud API key not configured');
    }

    // Get building insights
    const buildingInsightsResponse = await fetch(
      `https://solar.googleapis.com/v1/buildingInsights:findClosest?` +
      new URLSearchParams({
        'location.latitude': property.latitude.toString(),
        'location.longitude': property.longitude.toString(),
        key: apiKey,
      })
    );

    const buildingData = await buildingInsightsResponse.json();
    
    if (!buildingInsightsResponse.ok) {
      console.error('Building insights error:', buildingData);
      throw new Error('Failed to fetch building insights: ' + JSON.stringify(buildingData));
    }

    // Get data layers for visualization
    const dataLayersResponse = await fetch(
      `https://solar.googleapis.com/v1/dataLayers:get?` +
      new URLSearchParams({
        'location.latitude': property.latitude.toString(),
        'location.longitude': property.longitude.toString(),
        'radius_meters': '100',
        'required_quality': 'LOW',
        key: apiKey,
      })
    );

    const layersData = await dataLayersResponse.json();

    if (!dataLayersResponse.ok) {
      console.error('Data layers error:', layersData);
      throw new Error('Failed to fetch data layers: ' + JSON.stringify(layersData));
    }

    // Extract relevant data
    const solarPotential = buildingData.solarPotential;
    const financialData = buildingData.financialAnalyses?.[3] || null; // Using the $35 monthly bill scenario

    // Update solar calculation
    const { error: updateError } = await supabaseClient
      .from('solar_calculations')
      .update({
        status: 'completed',
        system_size: (solarPotential.maxArrayPanelsCount * solarPotential.panelCapacityWatts) / 1000,
        irradiance_data: {
          maxSunshineHours: solarPotential.maxSunshineHoursPerYear,
          carbonOffset: solarPotential.carbonOffsetFactorKgPerMwh,
          rgbUrl: layersData.rgbUrl,
        },
        panel_layout: {
          maxPanels: solarPotential.maxArrayPanelsCount,
          maxArea: solarPotential.maxArrayAreaMeters2,
          panelDimensions: {
            height: solarPotential.panelHeightMeters,
            width: solarPotential.panelWidthMeters,
          }
        },
        estimated_production: {
          yearlyEnergyDcKwh: financialData?.financialDetails?.initialAcKwhPerYear || null,
          monthlyBill: financialData?.monthlyBill?.units || null,
          financialDetails: financialData?.financialDetails || null,
        }
      })
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