import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { calculationId, latitude, longitude } = await req.json()

    if (!calculationId || !latitude || !longitude) {
      throw new Error('Missing required parameters')
    }

    console.log('Processing imagery for calculation:', calculationId)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Get the Google Cloud API key
    const apiKey = Deno.env.get('GOOGLE_CLOUD_API_KEY')
    if (!apiKey) {
      throw new Error('Google Cloud API key not found')
    }

    // Get data layers from Google Solar API
    const solarAPI = `https://solar.googleapis.com/v1/dataLayers:get?location.latitude=${latitude}&location.longitude=${longitude}&radiusMeters=100&view=FULL_LAYERS&key=${apiKey}`
    const response = await fetch(solarAPI)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data layers: ${response.statusText}`)
    }

    const dataLayers = await response.json()
    console.log('Received data layers:', dataLayers)

    // Process each layer in parallel
    const processPromises = []

    if (dataLayers.dsmUrl) {
      processPromises.push(
        fetch('https://solar.googleapis.com/v1/geoTiff:get', {
          method: 'POST',
          body: JSON.stringify({
            url: dataLayers.dsmUrl,
            propertyId: calculationId,
            apiKey
          })
        })
      )
    }

    if (dataLayers.rgbUrl) {
      processPromises.push(
        fetch('https://solar.googleapis.com/v1/geoTiff:get', {
          method: 'POST',
          body: JSON.stringify({
            url: dataLayers.rgbUrl,
            propertyId: calculationId,
            apiKey
          })
        })
      )
    }

    if (dataLayers.annualFluxUrl) {
      processPromises.push(
        fetch('https://solar.googleapis.com/v1/geoTiff:get', {
          method: 'POST',
          body: JSON.stringify({
            url: dataLayers.annualFluxUrl,
            propertyId: calculationId,
            apiKey,
            type: 'annual'
          })
        })
      )
    }

    // Wait for all processing to complete
    const results = await Promise.allSettled(processPromises)
    const processedImages = results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value
      } else {
        console.error(`Failed to process image ${index}:`, result.reason)
        return null
      }
    })

    // Update the calculation with processed imagery
    const { error: updateError } = await supabase
      .from('solar_calculations')
      .update({
        status: 'completed',
        building_specs: {
          imagery: {
            dsm: processedImages[0]?.filePath,
            rgb: processedImages[1]?.filePath,
            annualFlux: processedImages[2]?.filePath
          }
        }
      })
      .eq('id', calculationId)

    if (updateError) {
      throw updateError
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Imagery processed successfully',
        processedImages 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error processing solar imagery:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})