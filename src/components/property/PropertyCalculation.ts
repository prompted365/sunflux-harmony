import { supabase } from "@/integrations/supabase/client";
import { getSolarAPI } from "@/lib/solar-sdk";

export const calculateSolar = async (
  propertyId: string, 
  coordinates: { latitude: number; longitude: number },
  financialData: { monthlyBill: number | null; energyCostPerKwh: number },
  toast: (props: { title: string; description: string; variant?: "default" | "destructive" }) => void
) => {
  try {
    const solarAPI = getSolarAPI();
    
    // Get building insights using the SDK
    const buildingInsights = await solarAPI.getBuildingInsights(
      coordinates.latitude,
      coordinates.longitude
    );

    // Get environmental analysis
    const environmentalAnalysis = await solarAPI.analyzeEnvironment(
      coordinates.latitude,
      coordinates.longitude
    );

    // Insert solar calculation
    const { data: calculation, error: calcError } = await supabase
      .from('solar_calculations')
      .insert({
        property_id: propertyId,
        status: 'processing',
        system_size: buildingInsights.yearlyEnergyDcKwh / 1000, // Convert to kW
        irradiance_data: {
          maxSunshineHours: buildingInsights.maxSunshineHoursPerYear,
          carbonOffset: buildingInsights.annualCarbonOffsetKg,
        },
        estimated_production: {
          yearlyEnergyDcKwh: buildingInsights.yearlyEnergyDcKwh,
          environmentalImpact: {
            carbonOffset: environmentalAnalysis.carbonOffset,
            annualProduction: environmentalAnalysis.annualProduction,
            lifetimeProduction: environmentalAnalysis.lifetimeProduction
          }
        },
        building_specs: buildingInsights.solarPotential?.buildingStats || {}
      })
      .select()
      .single();

    if (calcError) throw calcError;

    // Trigger imagery processing
    const { error: imageryError } = await supabase.functions.invoke(
      'process-solar-imagery',
      {
        body: { 
          calculationId: calculation.id,
          latitude: coordinates.latitude,
          longitude: coordinates.longitude
        }
      }
    );

    if (imageryError) {
      console.error("Error processing imagery:", imageryError);
      toast({
        title: "Warning",
        description: "Solar calculation completed but imagery processing failed. Some visualizations may not be available.",
        variant: "destructive",
      });
    }

    // Create solar configuration with financial inputs
    const { error: configError } = await supabase
      .from('solar_configurations')
      .insert({
        property_id: propertyId,
        monthly_bill: financialData.monthlyBill,
        energy_cost_per_kwh: financialData.energyCostPerKwh,
        is_using_defaults: !financialData.monthlyBill
      });

    if (configError) throw configError;

    toast({
      title: "Success",
      description: "Solar calculation completed",
    });

    return calculation;
  } catch (error) {
    console.error("Error calculating solar:", error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to complete solar calculation",
      variant: "destructive",
    });
    return null;
  }
};