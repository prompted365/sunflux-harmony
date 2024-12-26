import { supabase } from "@/integrations/supabase/client";
import { getSolarAPI } from "@/lib/solar-sdk";
import { SolarCalculationError } from "@/lib/errors";

export const calculateSolar = async (
  propertyId: string, 
  coordinates: { latitude: number; longitude: number },
  financialData: { monthlyBill: number | null; energyCostPerKwh: number },
  toast: (props: { title: string; description: string; variant?: "default" | "destructive" }) => void
) => {
  try {
    const solarAPI = getSolarAPI();
    
    // Validate coordinates
    if (!coordinates.latitude || !coordinates.longitude) {
      throw new SolarCalculationError("Invalid coordinates provided");
    }

    // Validate financial data
    if (financialData.energyCostPerKwh <= 0) {
      throw new SolarCalculationError("Energy cost per kWh must be greater than 0");
    }
    
    // Get building insights using the SDK with error handling
    let buildingInsights;
    try {
      buildingInsights = await solarAPI.getBuildingInsights(
        coordinates.latitude,
        coordinates.longitude
      );
    } catch (error) {
      console.error("Building insights error:", error);
      throw new SolarCalculationError(
        "Failed to get building insights. Please verify the property location."
      );
    }

    // Get environmental analysis with error handling
    let environmentalAnalysis;
    try {
      environmentalAnalysis = await solarAPI.analyzeEnvironment(
        coordinates.latitude,
        coordinates.longitude
      );
    } catch (error) {
      console.error("Environmental analysis error:", error);
      throw new SolarCalculationError(
        "Failed to analyze environmental factors. Please try again."
      );
    }

    // Insert solar calculation with validation
    const { data: calculation, error: calcError } = await supabase
      .from('solar_calculations')
      .insert({
        property_id: propertyId,
        status: 'completed',
        system_size: buildingInsights.yearlyEnergyDcKwh / 1000,
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

    if (calcError) {
      console.error("Solar calculation insert error:", calcError);
      throw new SolarCalculationError(
        "Failed to save solar calculation. Please try again."
      );
    }

    // Create solar configuration with validation
    const { error: configError } = await supabase
      .from('solar_configurations')
      .insert({
        property_id: propertyId,
        monthly_bill: financialData.monthlyBill,
        energy_cost_per_kwh: financialData.energyCostPerKwh,
        is_using_defaults: !financialData.monthlyBill
      });

    if (configError) {
      console.error("Solar configuration insert error:", configError);
      throw new SolarCalculationError(
        "Failed to save solar configuration. Please try again."
      );
    }

    toast({
      title: "Success",
      description: "Solar calculation completed successfully",
    });

    return calculation;
  } catch (error) {
    console.error("Error calculating solar:", error);
    
    // Determine if it's a known error type or generic
    const errorMessage = error instanceof SolarCalculationError 
      ? error.message 
      : "An unexpected error occurred while calculating solar potential";
    
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });
    return null;
  }
};