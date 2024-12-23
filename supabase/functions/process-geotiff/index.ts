import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from "../_shared/cors.ts"

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { id, tiffUrl, maskUrl } = await req.json();

    // Validate required parameters
    if (!tiffUrl) {
      console.error('Missing required parameter: tiffUrl');
      return new Response(
        JSON.stringify({ error: 'Missing required parameter: tiffUrl' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (!id) {
      console.error('Missing required parameter: id');
      return new Response(
        JSON.stringify({ error: 'Missing required parameter: id' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch the GeoTIFF data
    console.log('Fetching GeoTIFF from:', tiffUrl);
    const tiffResponse = await fetch(tiffUrl);
    if (!tiffResponse.ok) {
      throw new Error(`Failed to fetch GeoTIFF: ${tiffResponse.statusText}`);
    }
    const tiffData = await tiffResponse.arrayBuffer();

    // If mask URL is provided, fetch mask data
    let maskData = null;
    if (maskUrl) {
      console.log('Fetching mask from:', maskUrl);
      const maskResponse = await fetch(maskUrl);
      if (!maskResponse.ok) {
        throw new Error(`Failed to fetch mask: ${maskResponse.statusText}`);
      }
      maskData = await maskResponse.arrayBuffer();
    }

    // Store the processed image in Supabase Storage
    const timestamp = new Date().getTime();
    const imagePath = `${id}/${timestamp}.png`;
    
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('solar_imagery')
      .upload(imagePath, tiffData, {
        contentType: 'image/png',
        upsert: true
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL for the uploaded image
    const { data: { publicUrl } } = supabase
      .storage
      .from('solar_imagery')
      .getPublicUrl(imagePath);

    return new Response(
      JSON.stringify({ 
        success: true,
        url: publicUrl
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Error processing GeoTIFF:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});