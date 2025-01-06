import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
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

    // List all files in the property's folder
    const { data: files, error: listError } = await supabase.storage
      .from('property-images')
      .list(propertyId);

    if (listError) {
      throw listError;
    }

    // Define the image types we're looking for
    const imageTypes = ['DSM', 'RGB', 'Mask', 'AnnualFlux', 'FluxOverRGB', 'MonthlyFluxCompositeGIF'];
    const arrayTypes = ['MonthlyFlux12', 'MonthlyFluxComposites'];
    
    const signedUrls: Record<string, string | string[]> = {};

    // Process single image types
    for (const type of imageTypes) {
      const matchingFile = files.find(f => f.name.startsWith(`${type}_`));
      if (matchingFile) {
        const { data } = await supabase.storage
          .from('property-images')
          .createSignedUrl(`${propertyId}/${matchingFile.name}`, 3600);
        
        if (data?.signedUrl) {
          signedUrls[type] = data.signedUrl;
        }
      }
    }

    // Process array image types
    for (const type of arrayTypes) {
      const matchingFiles = files
        .filter(f => f.name.startsWith(`${type}_`))
        .sort((a, b) => a.name.localeCompare(b.name));

      if (matchingFiles.length > 0) {
        const urlPromises = matchingFiles.map(file =>
          supabase.storage
            .from('property-images')
            .createSignedUrl(`${propertyId}/${file.name}`, 3600)
            .then(({ data }) => data?.signedUrl)
        );

        const urls = await Promise.all(urlPromises);
        signedUrls[type] = urls.filter(Boolean) as string[];
      }
    }

    console.log('Successfully generated signed URLs for property:', propertyId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        urls: signedUrls,
        property
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