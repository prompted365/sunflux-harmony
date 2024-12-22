import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { calculationId } = await req.json()
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { data: calculation, error: calcError } = await supabaseClient
      .from('solar_calculations')
      .select('*')
      .eq('id', calculationId)
      .single()

    if (calcError) throw calcError

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
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Solar System Analysis Report</h1>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="section">
            <h2>System Overview</h2>
            <div class="data-point">
              <strong>System Size:</strong> ${calculation.system_size.toFixed(2)} kW
            </div>
            <div class="data-point">
              <strong>Status:</strong> ${calculation.status}
            </div>
          </div>

          <div class="section">
            <h2>Solar Production</h2>
            <div class="data-point">
              <strong>Annual Production:</strong> 
              ${calculation.estimated_production?.yearlyEnergyDcKwh?.toFixed(2)} kWh
            </div>
            <div class="data-point">
              <strong>Max Sunshine Hours:</strong>
              ${calculation.irradiance_data?.maxSunshineHours} hours/year
            </div>
          </div>

          <div class="section">
            <h2>Environmental Impact</h2>
            <div class="data-point">
              <strong>Carbon Offset:</strong>
              ${calculation.irradiance_data?.carbonOffset?.toFixed(2)} kg CO2/year
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