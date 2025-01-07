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
      console.error('Error listing files:', listError)
      throw listError
    }

    console.log('Found files:', files?.map(f => f.name))

    // Find files that contain MonthlyFluxComposite and exactly one underscore
    const compositeFiles = files?.filter(f => {
      const underscoreCount = (f.name.match(/_/g) || []).length;
      return f.name.includes('MonthlyFluxComposite') && underscoreCount === 1;
    })

    if (!compositeFiles?.length) {
      console.log('No composite files found')
      return new Response(
        JSON.stringify({ error: 'No composite files found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    const sourceFile = compositeFiles[0]
    console.log('Processing file:', sourceFile.name)

    // If already a GIF, return the URL directly
    if (sourceFile.name.endsWith('.gif')) {
      console.log('File is already a GIF, getting public URL')
      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(`${propertyId}/${sourceFile.name}`)

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'File is already a GIF',
          url: publicUrl
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Download the source file
    console.log('Downloading source file')
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('property-images')
      .download(`${propertyId}/${sourceFile.name}`)

    if (downloadError) {
      console.error('Error downloading file:', downloadError)
      throw downloadError
    }

    // Create new filename with .gif extension
    const newFileName = `${sourceFile.name.split('.')[0]}.gif`
    console.log('New filename:', newFileName)
    
    // Upload as GIF
    console.log('Uploading as GIF')
    const { error: uploadError } = await supabase.storage
      .from('property-images')
      .upload(`${propertyId}/${newFileName}`, fileData, {
        contentType: 'image/gif',
        upsert: true
      })

    if (uploadError) {
      console.error('Error uploading GIF:', uploadError)
      throw uploadError
    }

    // Get the public URL of the uploaded GIF
    const { data: { publicUrl } } = supabase.storage
      .from('property-images')
      .getPublicUrl(`${propertyId}/${newFileName}`)

    console.log('Successfully processed and uploaded GIF:', newFileName)
    console.log('Public URL:', publicUrl)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Successfully processed file',
        fileName: newFileName,
        url: publicUrl
      }),
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