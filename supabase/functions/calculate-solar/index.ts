import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const GOOGLE_CLOUD_API_KEY = Deno.env.get('GOOGLE_CLOUD_API_KEY')!;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
    })
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Parse request body
    const { propertyId, latitude, longitude } = await req.json();

    // Validate required parameters
    if (!propertyId) {
      throw new Error('propertyId is required');
    }
    if (!latitude || typeof latitude !== 'number') {
      throw new Error('latitude is required and must be a number');
    }
    if (!longitude || typeof longitude !== 'number') {
      throw new Error('longitude is required and must be a number');
    }

    console.log('Calculating solar potential for:', { propertyId, latitude, longitude });

    // Call Google Solar API
    const solarResponse = await fetch(
      `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${latitude}&location.longitude=${longitude}&key=${GOOGLE_CLOUD_API_KEY}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!solarResponse.ok) {
      throw new Error('Failed to fetch solar data from Google API');
    }

    const solarData = await solarResponse.json();

    // Create solar calculation record
    const { data: calculation, error: insertError } = await supabase
      .from('solar_calculations')
      .insert({
        property_id: propertyId,
        status: 'completed',
        system_size: solarData.solarPotential?.maxArrayPanelsCount 
          ? (solarData.solarPotential.maxArrayPanelsCount * solarData.solarPotential.panelCapacityWatts / 1000)
          : null,
        irradiance_data: {
          maxSunshineHours: solarData.solarPotential?.maxSunshineHoursPerYear,
          carbonOffset: solarData.solarPotential?.carbonOffsetFactorKgPerMwh,
          annualSunlight: solarData.solarPotential?.wholeRoofStats?.sunshineQuantiles?.[0]
        },
        panel_layout: {
          maxPanels: solarData.solarPotential?.maxArrayPanelsCount,
          maxArea: solarData.solarPotential?.maxArrayAreaMeters2,
          panelDimensions: {
            height: solarData.solarPotential?.panelHeightMeters,
            width: solarData.solarPotential?.panelWidthMeters
          },
          optimalConfiguration: solarData.solarPotential?.solarPanelConfigs?.[0]
        },
        estimated_production: solarData.solarPotential?.solarPanelConfigs?.[0] 
          ? {
              yearlyEnergyDcKwh: solarData.solarPotential.solarPanelConfigs[0].yearlyEnergyDcKwh,
              monthlyBill: solarData.solarPotential.financialAnalyses?.[0]?.monthlyBill,
              financialDetails: solarData.solarPotential.financialAnalyses?.[0]?.financialDetails,
              environmentalImpact: {
                carbonOffset: solarData.solarPotential.carbonOffsetFactorKgPerMwh,
                treesEquivalent: Math.round((solarData.solarPotential.carbonOffsetFactorKgPerMwh * 20) / 21.7),
                homesEquivalent: Math.round(solarData.solarPotential.solarPanelConfigs[0].yearlyEnergyDcKwh / 10000)
              }
            }
          : null,
        building_specs: {
          address: solarData.postalCode,
          imagery: {}  // This will be populated by the process-imagery function
        }
      })
      .select()
      .single();

    if (insertError) {
      console.error('Failed to create calculation:', insertError);
      throw new Error(`Failed to create calculation: ${insertError.message}`);
    }

    console.log('Successfully created calculation:', calculation.id);

    // Return response with CORS headers
    return new Response(
      JSON.stringify({ success: true, calculationId: calculation.id }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );

  } catch (error) {
    console.error('Error calculating solar potential:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
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