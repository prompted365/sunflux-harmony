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

    // First verify the calculation exists and is complete
    const { data: calculation, error: fetchError } = await supabaseClient
      .from('solar_calculations')
      .select('*, properties(address, city, state, zip_code)')
      .eq('id', calculationId)
      .maybeSingle()

    if (fetchError) {
      console.error('Error fetching calculation:', fetchError)
      throw new Error('Failed to fetch calculation status')
    }
    
    if (!calculation) {
      console.error('No calculation found with ID:', calculationId)
      throw new Error('Calculation not found')
    }

    if (calculation.status !== 'completed') {
      console.error('Calculation status:', calculation.status)
      throw new Error('Calculation is still processing. Please wait for it to complete.')
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
      throw new Error('Failed to fetch data layer')
    }

    // Get the signed URL for the RGB image if it exists
    let rgbImageUrl = ''
    if (dataLayer?.rgb_url) {
      console.log('Found RGB URL:', dataLayer.rgb_url)
      const { data: signedUrlData, error: signedUrlError } = await supabaseClient
        .storage
        .from('solar_imagery')
        .createSignedUrl(dataLayer.rgb_url, 3600) // 1 hour expiry

      if (signedUrlError) {
        console.error('Error creating signed URL:', signedUrlError)
      } else if (signedUrlData) {
        rgbImageUrl = signedUrlData.signedUrl
        console.log('Generated signed URL for RGB image')
      }
    }

    const propertyAddress = calculation.properties ? 
      `${calculation.properties.address}, ${calculation.properties.city}, ${calculation.properties.state} ${calculation.properties.zip_code}` :
      'Address not available';

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Solar Calculation Report</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 40px; 
              line-height: 1.6;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px;
              padding: 20px;
              background: #f8f9fa;
              border-radius: 8px;
            }
            .section { 
              margin-bottom: 30px;
              padding: 20px;
              background: white;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .data-point { 
              margin: 15px 0;
              display: flex;
              justify-content: space-between;
              border-bottom: 1px solid #eee;
              padding-bottom: 10px;
            }
            img { 
              max-width: 100%; 
              height: auto;
              border-radius: 8px;
              margin: 20px 0;
            }
            .value {
              font-weight: bold;
              color: #2563eb;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Solar System Analysis Report</h1>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
            <p>${propertyAddress}</p>
            ${rgbImageUrl ? `
              <img src="${rgbImageUrl}" alt="Property Aerial View" />
            ` : ''}
          </div>
          
          <div class="section">
            <h2>System Overview</h2>
            <div class="data-point">
              <span>System Size:</span>
              <span class="value">${calculation.system_size?.toFixed(2) || 'N/A'} kW</span>
            </div>
            <div class="data-point">
              <span>Status:</span>
              <span class="value">${calculation.status}</span>
            </div>
          </div>

          <div class="section">
            <h2>Solar Production</h2>
            <div class="data-point">
              <span>Annual Production:</span>
              <span class="value">${calculation.estimated_production?.yearlyEnergyDcKwh?.toFixed(2) || 'N/A'} kWh</span>
            </div>
            <div class="data-point">
              <span>Max Sunshine Hours:</span>
              <span class="value">${calculation.irradiance_data?.maxSunshineHours || 'N/A'} hours/year</span>
            </div>
          </div>

          <div class="section">
            <h2>Environmental Impact</h2>
            <div class="data-point">
              <span>Carbon Offset:</span>
              <span class="value">${calculation.irradiance_data?.carbonOffset?.toFixed(2) || 'N/A'} kg CO2/year</span>
            </div>
          </div>

          ${calculation.financial_analysis ? `
            <div class="section">
              <h2>Financial Analysis</h2>
              <div class="data-point">
                <span>Initial Cost:</span>
                <span class="value">$${calculation.financial_analysis.initialCost?.toFixed(2) || 'N/A'}</span>
              </div>
              <div class="data-point">
                <span>Federal Incentive:</span>
                <span class="value">$${calculation.financial_analysis.federalIncentive?.toFixed(2) || 'N/A'}</span>
              </div>
              <div class="data-point">
                <span>Monthly Bill Savings:</span>
                <span class="value">$${calculation.financial_analysis.monthlyBillSavings?.toFixed(2) || 'N/A'}</span>
              </div>
              <div class="data-point">
                <span>Payback Period:</span>
                <span class="value">${calculation.financial_analysis.paybackYears?.toFixed(1) || 'N/A'} years</span>
              </div>
            </div>
          ` : ''}
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