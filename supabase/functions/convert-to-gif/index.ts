import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

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
    const { propertyId } = await req.json()

    if (!propertyId) {
      throw new Error('Property ID is required')
    }

    console.log('Processing property:', propertyId)

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // List files in the property folder
    const { data: files, error: listError } = await supabase.storage
      .from('property-images')
      .list(propertyId)

    if (listError) {
      throw listError
    }

    console.log('Found files:', files?.map(f => f.name))

    // Find MonthlyFluxComposite files
    const compositeFiles = files?.filter(f => {
      const pattern = /^MonthlyFluxComposite_\d+/
      return pattern.test(f.name)
    })

    if (compositeFiles?.length !== 1) {
      throw new Error(`Expected 1 composite file, found ${compositeFiles?.length}`)
    }

    const sourceFile = compositeFiles[0]
    console.log('Processing file:', sourceFile.name)

    // Download the source file
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('property-images')
      .download(`${propertyId}/${sourceFile.name}`)

    if (downloadError) {
      throw downloadError
    }

    // Convert to GIF if not already a GIF
    if (!sourceFile.name.endsWith('.gif')) {
      const newFileName = `${sourceFile.name.split('.')[0]}.gif`
      
      // Upload as GIF
      const { error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(`${propertyId}/${newFileName}`, fileData, {
          contentType: 'image/gif',
          upsert: true
        })

      if (uploadError) {
        throw uploadError
      }

      console.log('Successfully converted and uploaded GIF:', newFileName)

      // Delete the original file if different
      if (newFileName !== sourceFile.name) {
        const { error: deleteError } = await supabase.storage
          .from('property-images')
          .remove([`${propertyId}/${sourceFile.name}`])

        if (deleteError) {
          console.error('Error deleting original file:', deleteError)
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error processing file:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})