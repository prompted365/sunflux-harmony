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

    // Find files that contain MonthlyFluxComposite and exactly one underscore
    const compositeFiles = files?.filter(f => {
      // Count underscores in the filename
      const underscoreCount = (f.name.match(/_/g) || []).length;
      // Check if filename contains MonthlyFluxComposite and has exactly one underscore
      return f.name.includes('MonthlyFluxComposite') && underscoreCount === 1;
    })

    if (!compositeFiles?.length) {
      return new Response(
        JSON.stringify({ error: 'No composite files found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    if (compositeFiles.length > 1) {
      return new Response(
        JSON.stringify({ error: 'Multiple composite files found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const sourceFile = compositeFiles[0]
    console.log('Processing file:', sourceFile.name)

    // If already a GIF, just return success
    if (sourceFile.name.endsWith('.gif')) {
      return new Response(
        JSON.stringify({ success: true, message: 'File is already a GIF' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Download the source file
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('property-images')
      .download(`${propertyId}/${sourceFile.name}`)

    if (downloadError) {
      throw downloadError
    }

    // Create new filename with .gif extension
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

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Successfully processed file',
        fileName: newFileName
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error processing file:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    )
  }
})