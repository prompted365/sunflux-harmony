import { supabase } from "@/integrations/supabase/client";
import { getSolarAPI } from "@/lib/solar-sdk";
import { Toast } from "@/components/ui/use-toast";

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

    if (buildingInsights.error) {
      throw new Error(buildingInsights.error);
    }

    // Get environmental analysis
    const environmentalAnalysis = await solarAPI.analyzeEnvironment(
      coordinates.latitude,
      coordinates.longitude
    );

    if ('error' in environmentalAnalysis) {
      throw new Error(environmentalAnalysis.error);
    }

    const { error: calcError } = await supabase
      .from('solar_calculations')
      .insert({
        property_id: propertyId,
        status: 'completed',
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
        }
      });

    if (calcError) throw calcError;

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

    return true;
  } catch (error) {
    console.error("Error calculating solar:", error);
    toast({
      title: "Error",
      description: "Failed to complete solar calculation",
      variant: "destructive",
    });
    return false;
  }
};