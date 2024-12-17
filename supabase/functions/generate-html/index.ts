import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

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
    const { htmlContent, filename } = await req.json()
    
    if (!htmlContent || !filename) {
      throw new Error('HTML content and filename are required')
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Generate a unique filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filePath = `html/${filename}_${timestamp}.html`

    // Upload HTML content to the reports bucket
    const { error: uploadError } = await supabase
      .storage
      .from('reports')
      .upload(filePath, htmlContent, {
        contentType: 'text/html; charset=utf-8',
        upsert: false
      })

    if (uploadError) {
      throw new Error('Failed to upload HTML file')
    }

    // Create a signed URL for downloading
    const { data: { signedUrl }, error: urlError } = await supabase
      .storage
      .from('reports')
      .createSignedUrl(filePath, 60 * 60 * 24) // URL valid for 24 hours

    if (urlError) {
      throw new Error('Failed to generate download URL')
    }

    return new Response(
      JSON.stringify({ 
        message: 'HTML file generated successfully',
        downloadUrl: signedUrl
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('HTML generation error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})