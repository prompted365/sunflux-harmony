import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl } = await req.json();

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