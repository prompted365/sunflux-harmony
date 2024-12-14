import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'

interface BuildingInsightsResponse {
  name: string;
  center: {
    latitude: number;
    longitude: number;
  };
  confidence: number;
  solarPotential: {
    maxArrayPanelsCount: number;
    maxArrayAreaMeters2: number;
    maxSunshineHoursPerYear: number;
    carbonOffsetFactorKgPerMwh: number;
    panelCapacityWatts: number;
    panelHeightMeters: number;
    panelWidthMeters: number;
    yearlyEnergyDcKwh: number;
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { propertyId } = await req.json()
    console.log('Received request for property:', propertyId)

    if (!propertyId) {
      throw new Error('Property ID is required')
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch property details
    const { data: property, error: propertyError } = await supabaseClient
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single()

    if (propertyError || !property) {
      console.error('Property fetch error:', propertyError)
      throw new Error('Property not found')
    }

    console.log('Found property:', property)

    // Create initial solar calculation record
    const { data: calculation, error: calculationError } = await supabaseClient
      .from('solar_calculations')
      .insert({
        property_id: propertyId,
        status: 'processing'
      })
      .select()
      .single()

    if (calculationError) {
      console.error('Calculation creation error:', calculationError)
      throw new Error('Failed to create calculation record')
    }

    // Construct the Google Solar API request
    const address = `${property.address}, ${property.city}, ${property.state} ${property.zip_code}`
    const apiKey = Deno.env.get('GOOGLE_CLOUD_API_KEY')
    
    if (!apiKey) {
      console.error('Google Cloud API key not found')
      throw new Error('API key configuration missing')
    }

    const encodedAddress = encodeURIComponent(address)
    const url = `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.address=${encodedAddress}&key=${apiKey}`
    
    console.log('Calling Google Solar API for address:', address)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Google Solar API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      })
      throw new Error(`Google Solar API error: ${response.status} ${response.statusText}`)
    }

    const solarData: BuildingInsightsResponse = await response.json()
    console.log('Received solar data:', solarData)

    // Update calculation with results
    const { error: updateError } = await supabaseClient
      .from('solar_calculations')
      .update({
        status: 'completed',
        irradiance_data: {
          maxSunshineHours: solarData.solarPotential.maxSunshineHoursPerYear,
          carbonOffset: solarData.solarPotential.carbonOffsetFactorKgPerMwh
        },
        panel_layout: {
          maxPanels: solarData.solarPotential.maxArrayPanelsCount,
          maxArea: solarData.solarPotential.maxArrayAreaMeters2,
          panelDimensions: {
            height: solarData.solarPotential.panelHeightMeters,
            width: solarData.solarPotential.panelWidthMeters
          }
        },
        system_size: solarData.solarPotential.panelCapacityWatts * solarData.solarPotential.maxArrayPanelsCount / 1000,
        estimated_production: {
          yearlyEnergyDcKwh: solarData.solarPotential.yearlyEnergyDcKwh
        }
      })
      .eq('id', calculation.id)

    if (updateError) {
      console.error('Calculation update error:', updateError)
      throw new Error('Failed to update calculation results')
    }

    // Update property with lat/long if not already set
    if (!property.latitude || !property.longitude) {
      await supabaseClient
        .from('properties')
        .update({
          latitude: solarData.center.latitude,
          longitude: solarData.center.longitude
        })
        .eq('id', propertyId)
    }

    return new Response(
      JSON.stringify({ 
        message: 'Solar calculation completed successfully',
        calculationId: calculation.id 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})