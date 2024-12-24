import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { calculationId, filename = 'solar-report' } = await req.json()
    
    if (!calculationId) {
      throw new Error('Calculation ID is required')
    }

    console.log('Generating HTML for calculation:', calculationId)

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Use maybeSingle() instead of single() to handle no results case
    const { data: calculation, error: calcError } = await supabaseClient
      .from('solar_calculations')
      .select('*, properties(address, city, state, zip_code)')
      .eq('id', calculationId)
      .maybeSingle()

    if (calcError) {
      console.error('Error fetching calculation:', calcError)
      throw calcError
    }

    if (!calculation) {
      console.error('No calculation found with ID:', calculationId)
      throw new Error('Calculation not found')
    }

    console.log('Found calculation:', calculation.id)

    // Get the RGB image URL from data_layers
    const { data: dataLayer, error: dataLayerError } = await supabaseClient
      .from('data_layers')
      .select('rgb_url')
      .eq('calculation_id', calculationId)
      .maybeSingle()

    if (dataLayerError) {
      console.error('Error fetching data layer:', dataLayerError)
      throw dataLayerError
    }

    // Get the image data from storage if URL exists
    let rgbImageUrl = ''
    if (dataLayer?.rgb_url) {
      const { data: imageData, error: storageError } = await supabaseClient
        .storage
        .from('solar_imagery')
        .createSignedUrl(dataLayer.rgb_url, 3600) // 1 hour expiry

      if (!storageError && imageData) {
        rgbImageUrl = imageData.signedUrl
      }
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Solar Calculation Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 20px; }
            .data-point { margin: 10px 0; }
            img { max-width: 100%; height: auto; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Solar System Analysis Report</h1>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
            ${calculation.properties ? `
              <p>Property: ${calculation.properties.address}, ${calculation.properties.city}, ${calculation.properties.state} ${calculation.properties.zip_code}</p>
            ` : ''}
            ${rgbImageUrl ? `
              <img src="${rgbImageUrl}" alt="Property Aerial View" />
            ` : ''}
          </div>
          
          <div class="section">
            <h2>System Overview</h2>
            <div class="data-point">
              <strong>System Size:</strong> ${calculation.system_size?.toFixed(2) || 'N/A'} kW
            </div>
            <div class="data-point">
              <strong>Status:</strong> ${calculation.status}
            </div>
          </div>

          <div class="section">
            <h2>Solar Production</h2>
            <div class="data-point">
              <strong>Annual Production:</strong> 
              ${calculation.estimated_production?.yearlyEnergyDcKwh?.toFixed(2) || 'N/A'} kWh
            </div>
            <div class="data-point">
              <strong>Max Sunshine Hours:</strong>
              ${calculation.irradiance_data?.maxSunshineHours || 'N/A'} hours/year
            </div>
          </div>

          <div class="section">
            <h2>Environmental Impact</h2>
            <div class="data-point">
              <strong>Carbon Offset:</strong>
              ${calculation.irradiance_data?.carbonOffset?.toFixed(2) || 'N/A'} kg CO2/year
            </div>
          </div>
        </body>
      </html>
    `

    return new Response(
      JSON.stringify({ success: true, html }),
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
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 400
      }
    )
  }
})