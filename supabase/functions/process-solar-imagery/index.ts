import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { processAndStoreImagery } from '../calculate-solar/utils/solarApi.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { propertyId, calculationId, latitude, longitude } = await req.json()
    
    if (!propertyId || !calculationId || !latitude || !longitude) {
      throw new Error('Missing required parameters')
    }

    console.log('Processing imagery for property:', propertyId)

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Process and store imagery
    const imageryUrls = await processAndStoreImagery(
      { latitude, longitude },
      propertyId,
      supabaseClient,
      Deno.env.get('GOOGLE_CLOUD_API_KEY') ?? ''
    )
    
    // Update calculation with imagery URLs
    const { error: updateError } = await supabaseClient
      .from('solar_calculations')
      .update({
        status: 'completed',
        building_specs: {
          imagery: imageryUrls
        }
      })
      .eq('id', calculationId)

    if (updateError) {
      throw updateError
    }

    return new Response(
      JSON.stringify({ message: 'Imagery processing completed successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Imagery processing error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})