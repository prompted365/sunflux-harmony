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
    const { propertyId } = await req.json();

    if (!propertyId) {
      throw new Error('Property ID is required');
    }

    console.log('Getting signed URLs for property:', propertyId);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get property details
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single();

    if (propertyError) {
      throw propertyError;
    }

    if (!property) {
      throw new Error('Property not found');
    }

    // Define image types to process
    const singleImageTypes = ['DSM', 'RGB', 'Mask', 'AnnualFlux', 'FluxOverRGB', 'MonthlyFluxCompositeGIF'];
    const arrayImageTypes = ['MonthlyFlux12', 'MonthlyFluxComposites'];

    const signedUrls: Record<string, string | string[]> = {};

    // Process single image types
    for (const type of singleImageTypes) {
      const imagePath = property[type];
      if (imagePath) {
        const { data: { signedUrl }, error } = await supabase
          .storage
          .from('property-images')
          .createSignedUrl(imagePath, 3600); // 1 hour expiry

        if (!error && signedUrl) {
          signedUrls[type] = signedUrl;
        }
      }
    }

    // Process array image types
    for (const type of arrayImageTypes) {
      const imagePaths = property[type];
      if (Array.isArray(imagePaths) && imagePaths.length > 0) {
        const signedUrlPromises = imagePaths.map(path => 
          supabase.storage
            .from('property-images')
            .createSignedUrl(path, 3600)
            .then(({ data }) => data?.signedUrl)
        );

        const urls = await Promise.all(signedUrlPromises);
        signedUrls[type] = urls.filter(Boolean) as string[];
      }
    }

    // Check if all required images are present and update status if needed
    const requiredImages = ['DSM', 'RGB', 'Mask', 'AnnualFlux', 'FluxOverRGB', 'MonthlyFluxCompositeGIF'];
    const allImagesPresent = requiredImages.every(type => property[type]);

    if (allImagesPresent && property.imagery_status === 'pending') {
      console.log('All images present, updating imagery status to completed');
      const { error: updateError } = await supabase
        .from('properties')
        .update({ imagery_status: 'completed' })
        .eq('id', propertyId);

      if (updateError) {
        console.error('Error updating imagery status:', updateError);
      }
    }

    console.log('Successfully generated signed URLs for property:', propertyId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        urls: signedUrls,
        status: property.status,
        imageryStatus: allImagesPresent ? 'completed' : property.imagery_status
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error generating signed URLs:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
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