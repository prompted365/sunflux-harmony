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
    const { url, propertyId, apiKey, type } = await req.json()
    console.log(`Processing ${type} flux for property:`, propertyId)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Fetch and process flux data
    const response = await fetch(url.includes('solar.googleapis.com') ? 
      `${url}&key=${apiKey}` : url)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch flux data: ${response.statusText}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    const tiff = await geotiff.fromArrayBuffer(arrayBuffer)
    const image = await tiff.getImage()
    const rasters = await image.readRasters()

    // Convert to heatmap PNG
    const width = image.getWidth()
    const height = image.getHeight()
    const canvas = new OffscreenCanvas(width, height)
    const ctx = canvas.getContext('2d')!
    const imageData = ctx.createImageData(width, height)

    // Create heatmap colors
    const colors = [
      [0, 0, 255],    // Blue
      [0, 255, 0],    // Green
      [255, 255, 0],  // Yellow
      [255, 0, 0]     // Red
    ]

    const data = rasters[0] as Float32Array
    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min

    for (let i = 0; i < data.length; i++) {
      const normalized = (data[i] - min) / range
      const colorIndex = Math.min(Math.floor(normalized * (colors.length - 1)), colors.length - 2)
      const t = (normalized * (colors.length - 1)) % 1

      const c1 = colors[colorIndex]
      const c2 = colors[colorIndex + 1]

      const idx = i * 4
      imageData.data[idx] = c1[0] + (c2[0] - c1[0]) * t
      imageData.data[idx + 1] = c1[1] + (c2[1] - c1[1]) * t
      imageData.data[idx + 2] = c1[2] + (c2[2] - c1[2]) * t
      imageData.data[idx + 3] = 255
    }

    ctx.putImageData(imageData, 0, 0)
    const blob = await canvas.convertToBlob()
    const arrayBufferPng = await blob.arrayBuffer()

    // Upload to storage
    const filePath = `${propertyId}/${type}_flux.png`
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
    console.error('Error processing flux:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})