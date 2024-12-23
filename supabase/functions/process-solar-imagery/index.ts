import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from "../_shared/cors.ts"

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl, calculationId, latitude, longitude } = await req.json();

    // Validate required parameters
    if (!imageUrl) {
      console.error('Missing required parameter: imageUrl');
      return new Response(
        JSON.stringify({ error: 'Missing required parameter: imageUrl' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Get the Google Cloud API key from environment variables
    const apiKey = Deno.env.get('GOOGLE_CLOUD_API_KEY');
    if (!apiKey) {
      console.error('Google Cloud API key not found');
      return new Response(
        JSON.stringify({ error: 'Internal server error - API key not configured' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // If calculationId is provided, store data layers info
    if (calculationId) {
      const { data: dataLayers, error: fetchError } = await supabase
        .from('data_layers')
        .select('*')
        .eq('calculation_id', calculationId)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching data layers:', fetchError);
        throw fetchError;
      }

      if (dataLayers) {
        // Format dates properly for PostgreSQL
        const formatDate = (dateObj: any) => {
          if (!dateObj) return null;
          const { year, month, day } = dateObj;
          return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        };

        const { error: updateError } = await supabase
          .from('data_layers')
          .update({
            imagery_date: formatDate(dataLayers.imagery_date),
            imagery_processed_date: formatDate(dataLayers.imagery_processed_date),
            processed_at: new Date().toISOString()
          })
          .eq('calculation_id', calculationId);

        if (updateError) {
          console.error('Error updating data layers:', updateError);
          throw updateError;
        }
      }
    }

    // Append API key to the image URL
    const fullUrl = `${imageUrl}&key=${apiKey}`;
    console.log('Fetching image from:', fullUrl);

    // Fetch the image
    const response = await fetch(fullUrl);
    if (!response.ok) {
      console.error('Failed to fetch image:', await response.text());
      return new Response(
        JSON.stringify({ error: `Failed to fetch image: ${response.statusText}` }),
        { 
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Get the image data
    const imageData = await response.arrayBuffer();
    
    return new Response(
      new Uint8Array(imageData),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/octet-stream'
        }
      }
    );

  } catch (error) {
    console.error('Error processing solar imagery:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});