import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from "../_shared/cors.ts"
import { getBuildingInsights } from "./utils/solarApi.ts"

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const GOOGLE_CLOUD_API_KEY = Deno.env.get('GOOGLE_CLOUD_API_KEY')!;

serve(async (req) => {
  // This is important! Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
    });
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

    // Get building insights from Google Solar API
    const buildingInsights = await getBuildingInsights(
      { latitude, longitude },
      GOOGLE_CLOUD_API_KEY
    );

    if (!buildingInsights) {
      throw new Error('Failed to get building insights');
    }

    console.log('Successfully retrieved building insights');

    // Create solar calculation record
    const { data: calculation, error: insertError } = await supabase
      .from('solar_calculations')
      .insert({
        property_id: propertyId,
        status: 'pending',
        system_size: buildingInsights.solarPotential?.maxArrayPanelsCount 
          ? (buildingInsights.solarPotential.maxArrayPanelsCount * buildingInsights.solarPotential.panelCapacityWatts / 1000)
          : null,
        irradiance_data: {
          maxSunshineHours: buildingInsights.solarPotential?.maxSunshineHoursPerYear,
          carbonOffset: buildingInsights.solarPotential?.carbonOffsetFactorKgPerMwh,
          annualSunlight: buildingInsights.solarPotential?.wholeRoofStats?.sunshineQuantiles?.[0]
        },
        panel_layout: {
          maxPanels: buildingInsights.solarPotential?.maxArrayPanelsCount,
          maxArea: buildingInsights.solarPotential?.maxArrayAreaMeters2,
          panelDimensions: {
            height: buildingInsights.solarPotential?.panelHeightMeters,
            width: buildingInsights.solarPotential?.panelWidthMeters
          },
          optimalConfiguration: buildingInsights.solarPotential?.solarPanelConfigs?.[0]
        },
        estimated_production: buildingInsights.solarPotential?.solarPanelConfigs?.[0] 
          ? {
              yearlyEnergyDcKwh: buildingInsights.solarPotential.solarPanelConfigs[0].yearlyEnergyDcKwh,
              monthlyBill: buildingInsights.solarPotential.financialAnalyses?.[0]?.monthlyBill,
              financialDetails: buildingInsights.solarPotential.financialAnalyses?.[0]?.financialDetails,
              environmentalImpact: {
                carbonOffset: buildingInsights.solarPotential.carbonOffsetFactorKgPerMwh,
                treesEquivalent: Math.round((buildingInsights.solarPotential.carbonOffsetFactorKgPerMwh * 20) / 21.7),
                homesEquivalent: Math.round(buildingInsights.solarPotential.solarPanelConfigs[0].yearlyEnergyDcKwh / 10000)
              }
            }
          : null,
        financial_analysis: buildingInsights.solarPotential?.financialAnalyses?.[0]?.financialDetails
          ? {
              initialCost: buildingInsights.solarPotential.financialAnalyses[0].financialDetails.costOfElectricityWithoutSolar,
              federalIncentive: buildingInsights.solarPotential.financialAnalyses[0].financialDetails.federalIncentive,
              monthlyBillSavings: buildingInsights.solarPotential.financialAnalyses[0].financialDetails.lifetimeSrecTotal,
              paybackYears: buildingInsights.solarPotential.financialAnalyses[0].cashPurchaseSavings?.paybackYears || 0
            }
          : null,
        building_specs: {
          address: buildingInsights.postalCode,
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

    // Trigger imagery processing
    const { error: functionError } = await supabase.functions.invoke(
      'process-solar-imagery',
      {
        body: { 
          calculationId: calculation.id,
          latitude,
          longitude
        }
      }
    );

    if (functionError) {
      console.error('Failed to trigger imagery processing:', functionError);
      throw new Error(`Failed to trigger imagery processing: ${functionError.message}`);
    }

    // Return response with proper CORS headers
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