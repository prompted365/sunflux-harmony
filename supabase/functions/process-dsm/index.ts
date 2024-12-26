import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import * as geotiff from 'https://esm.sh/geotiff@2.1.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { url, propertyId, apiKey } = await req.json()
    console.log('Processing DSM for property:', propertyId)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Fetch and process DSM data
    const response = await fetch(url.includes('solar.googleapis.com') ? 
      `${url}&key=${apiKey}` : url)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch DSM: ${response.statusText}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    const tiff = await geotiff.fromArrayBuffer(arrayBuffer)
    const image = await tiff.getImage()
    const rasters = await image.readRasters()

    // Convert to PNG for storage
    const width = image.getWidth()
    const height = image.getHeight()
    const canvas = new OffscreenCanvas(width, height)
    const ctx = canvas.getContext('2d')!
    const imageData = ctx.createImageData(width, height)

    // Normalize elevation data to 0-255 range
    const data = rasters[0] as Float32Array
    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min

    for (let i = 0; i < data.length; i++) {
      const normalized = ((data[i] - min) / range) * 255
      const idx = i * 4
      imageData.data[idx] = normalized
      imageData.data[idx + 1] = normalized
      imageData.data[idx + 2] = normalized
      imageData.data[idx + 3] = 255
    }

    ctx.putImageData(imageData, 0, 0)
    const blob = await canvas.convertToBlob()
    const arrayBufferPng = await blob.arrayBuffer()

    // Upload to storage
    const filePath = `${propertyId}/dsm.png`
    const { error: uploadError } = await supabase.storage
      .from('solar_imagery')
      .upload(filePath, new Uint8Array(arrayBufferPng), {
        contentType: 'image/png',
        upsert: true
      })

    if (uploadError) {
      throw uploadError
    }

    return new Response(
      JSON.stringify({ success: true, filePath }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error processing DSM:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})