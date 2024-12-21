import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from "../_shared/cors.ts"

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const GOOGLE_CLOUD_API_KEY = Deno.env.get('GOOGLE_CLOUD_API_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { propertyId } = await req.json();

    if (!propertyId) {
      throw new Error('Property ID is required');
    }

    // 1. Get property details
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single();

    if (propertyError || !property) {
      throw new Error(`Failed to fetch property: ${propertyError?.message}`);
    }

    // Ensure we have coordinates
    if (!property.latitude || !property.longitude) {
      throw new Error('Property must have latitude and longitude coordinates');
    }

    // 2. Create initial solar calculation record
    const { data: calculation, error: calcError } = await supabase
      .from('solar_calculations')
      .insert({
        property_id: propertyId,
        status: 'pending'
      })
      .select()
      .single();

    if (calcError) {
      throw new Error(`Failed to create calculation: ${calcError.message}`);
    }

    // 3. Trigger building insights processing asynchronously
    const processResponse = await fetch(`${SUPABASE_URL}/functions/v1/process-solar-imagery`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({
        calculationId: calculation.id,
        latitude: property.latitude,
        longitude: property.longitude
      })
    });

    if (!processResponse.ok) {
      console.error('Failed to trigger processing:', await processResponse.text());
      // Don't throw here, we still want to return the calculation ID
    }

    return new Response(
      JSON.stringify({ calculationId: calculation.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});