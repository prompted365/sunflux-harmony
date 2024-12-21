import { supabase } from "@/integrations/supabase/client";
import type { BuildingInsights, EnvironmentalAnalysis, Panel, OptimizedPanels, ROIMetrics } from "./types";

export class SolarAPI {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = "https://solar.googleapis.com/v1";
  }

  async getBuildingInsights(lat: number, long: number): Promise<BuildingInsights> {
    try {
      console.log("Fetching building insights for coordinates:", { lat, long });
      
      const response = await fetch(
        `${this.baseUrl}/buildingInsights:findClosest?location.latitude=${lat}&location.longitude=${long}&key=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Building insights response:", data);

      if (!data.solarPotential) {
        throw new Error("No solar potential data available for this location");
      }

      return {
        roofArea: data.solarPotential.maxArrayAreaMeters2 || 0,
        roofTilt: data.solarPotential.roofSegmentStats?.[0]?.pitchDegrees || 0,
        shading: data.solarPotential.wholeRoofStats?.sunshineQuantiles?.[0] || 0,
        yearlyEnergyDcKwh: data.solarPotential.maxSunshineHoursPerYear || 0,
        lifetimeEnergyDcKwh: (data.solarPotential.maxSunshineHoursPerYear || 0) * (data.solarPotential.panelLifetimeYears || 20),
        annualCarbonOffsetKg: data.solarPotential.carbonOffsetFactorKgPerMwh || 0,
        maxSunshineHoursPerYear: data.solarPotential.maxSunshineHoursPerYear || 0
      };
    } catch (error) {
      console.error("Building insights error:", error);
      throw error;
    }
  }

  async analyzeEnvironment(lat: number, long: number): Promise<EnvironmentalAnalysis> {
    const insights = await this.getBuildingInsights(lat, long);
    
    return {
      solarIrradiance: insights.maxSunshineHoursPerYear,
      carbonOffset: insights.annualCarbonOffsetKg,
      annualProduction: insights.yearlyEnergyDcKwh,
      lifetimeProduction: insights.lifetimeEnergyDcKwh
    };
  }
}

// Create and export a singleton instance that will be initialized with the API key
let solarAPI: SolarAPI;

// Initialize the API with the secret from Supabase
export const initializeSolarAPI = async () => {
  const { data: { GOOGLE_MAPS_API_KEY } } = await supabase.functions.invoke('get-secret', {
    body: { name: 'GOOGLE_MAPS_API_KEY' }
  });
  
  if (!GOOGLE_MAPS_API_KEY) {
    console.error('Google Maps API key not found in Supabase secrets');
    return new SolarAPI(''); // Return instance with empty key to avoid breaking the app
  }

  solarAPI = new SolarAPI(GOOGLE_MAPS_API_KEY);
  return solarAPI;
};

// Export the initialization function and a getter for the API instance
export const getSolarAPI = () => {
  if (!solarAPI) {
    throw new Error('Solar API not initialized. Call initializeSolarAPI() first.');
  }
  return solarAPI;
};