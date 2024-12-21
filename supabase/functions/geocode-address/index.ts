import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { address, city, state, zipCode } = await req.json()
    
    if (!address || !city || !state || !zipCode) {
      throw new Error('Missing required address components')
    }

    const addressString = `${address}, ${city}, ${state} ${zipCode}`
    console.log('Geocoding address:', addressString)

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        addressString
      )}&key=${Deno.env.get('GOOGLE_MAPS_API_KEY')}`
    )
    
    const data = await response.json()
    
    if (data.status !== "OK") {
      console.error('Geocoding failed:', data)
      throw new Error(`Failed to geocode address: ${data.status}`)
    }

    const { lat, lng } = data.results[0].geometry.location
    
    return new Response(
      JSON.stringify({ latitude: lat, longitude: lng }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in geocode-address function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})