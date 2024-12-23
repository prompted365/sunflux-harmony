import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ProcessGeoTiffRequest {
  tiffUrl: string;
  maskUrl?: string;
  calculationId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tiffUrl, maskUrl, calculationId } = await req.json() as ProcessGeoTiffRequest;

    if (!tiffUrl) {
      throw new Error('Missing required parameter: tiffUrl');
    }

    if (!calculationId) {
      throw new Error('Missing required parameter: calculationId');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch the GeoTIFF data
    const tiffResponse = await fetch(tiffUrl);
    if (!tiffResponse.ok) {
      throw new Error(`Failed to fetch GeoTIFF: ${tiffResponse.statusText}`);
    }

    const tiffData = await tiffResponse.arrayBuffer();
    console.log('Successfully fetched GeoTIFF data, size:', tiffData.byteLength);

    // If mask URL is provided, fetch mask data
    let maskData = null;
    if (maskUrl) {
      const maskResponse = await fetch(maskUrl);
      if (!maskResponse.ok) {
        throw new Error(`Failed to fetch mask: ${maskResponse.statusText}`);
      }
      maskData = await maskResponse.arrayBuffer();
      console.log('Successfully fetched mask data, size:', maskData.byteLength);
    }

    // Generate a unique filename for storage
    const filename = `${calculationId}-${Date.now()}.tiff`;

    // Store the processed GeoTIFF in Supabase Storage
    const { error: uploadError } = await supabase
      .storage
      .from('solar_imagery')
      .upload(filename, tiffData);

    if (uploadError) {
      throw uploadError;
    }

    // Get a signed URL for the uploaded file
    const { data: { signedUrl }, error: signedUrlError } = await supabase
      .storage
      .from('solar_imagery')
      .createSignedUrl(filename, 3600); // URL valid for 1 hour

    if (signedUrlError) {
      throw signedUrlError;
    }

    // Update data_layers table with the new imagery
    const { error: updateError } = await supabase
      .from('data_layers')
      .update({ 
        processed_at: new Date().toISOString(),
        rgb_url: signedUrl 
      })
      .eq('calculation_id', calculationId);

    if (updateError) {
      throw updateError;
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        url: signedUrl
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
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});