import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { processAndStoreImagery } from './utils/imageProcessing.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { calculationId } = await req.json()
    
    if (!calculationId) {
      throw new Error('Calculation ID is required')
    }

    console.log('Processing imagery for calculation:', calculationId)

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch data layers from database
    const { data: dataLayer, error: fetchError } = await supabaseClient
      .from('data_layers')
      .select('*')
      .eq('calculation_id', calculationId)
      .single();

    if (fetchError) {
      console.error('Error fetching data layer:', fetchError)
      throw new Error(`Failed to fetch data layer: ${fetchError.message}`)
    }

    if (!dataLayer) {
      console.error('No data layer found for calculation:', calculationId)
      throw new Error('No data layer found for calculation')
    }

    console.log('Found data layer:', dataLayer.id)

    // Process and store imagery
    const imageryUrls = await processAndStoreImagery(
      dataLayer,
      calculationId,
      supabaseClient,
      Deno.env.get('GOOGLE_CLOUD_API_KEY') ?? ''
    );
    
    // Update calculation with imagery URLs
    const { error: updateError } = await supabaseClient
      .from('data_layers')
      .update({
        processed_at: new Date().toISOString(),
        building_specs: {
          imagery: imageryUrls
        }
      })
      .eq('id', dataLayer.id);

    if (updateError) {
      console.error('Error updating data layer:', updateError)
      throw updateError;
    }

    console.log('Successfully processed imagery for calculation:', calculationId)

    return new Response(
      JSON.stringify({ 
        message: 'Imagery processing completed successfully',
        dataLayerId: dataLayer.id 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Imagery processing error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})