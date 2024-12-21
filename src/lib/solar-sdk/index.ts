import { supabase } from "@/integrations/supabase/client";
import type { BuildingInsights, EnvironmentalAnalysis, Panel, OptimizedPanels, ROIMetrics } from "./types";

export class SolarAPI {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = "https://solar.googleapis.com/v1";
  }

  async getBuildingInsights(lat: number, long: number, quality: string = "HIGH"): Promise<BuildingInsights> {
    try {
      const response = await fetch(
        `${this.baseUrl}/buildingInsights:findClosest?location.latitude=${lat}&location.longitude=${long}&requiredQuality=${quality}&key=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      const { solarPotential, wholeRoofStats } = data;

      if (!solarPotential || !solarPotential.solarPanelConfigs) {
        throw new Error("Solar panel placement not feasible for this property.");
      }

      return {
        roofArea: wholeRoofStats.maxArrayAreaMeters2,
        roofTilt: solarPotential.solarPanelConfigs[0]?.roofSegmentSummaries[0]?.pitchDegrees,
        shading: solarPotential.irradianceData?.shadingFactor,
        yearlyEnergyDcKwh: solarPotential.maxSunshineHoursPerYear,
        lifetimeEnergyDcKwh: solarPotential.maxSunshineHoursPerYear * solarPotential.panelLifetimeYears,
        annualCarbonOffsetKg: solarPotential.carbonOffsetFactorKgPerMwh * (solarPotential.maxSunshineHoursPerYear / 1000),
        maxSunshineHoursPerYear: solarPotential.maxSunshineHoursPerYear,
        error: undefined
      };
    } catch (error) {
      console.error("Building insights error:", error);
      return {
        roofArea: 0,
        roofTilt: 0,
        shading: 0,
        yearlyEnergyDcKwh: 0,
        lifetimeEnergyDcKwh: 0,
        annualCarbonOffsetKg: 0,
        maxSunshineHoursPerYear: 0,
        error: error.message
      };
    }
  }

  async analyzeEnvironment(lat: number, long: number): Promise<EnvironmentalAnalysis> {
    const insights = await this.getBuildingInsights(lat, long);
    if (insights.error) {
      return {
        solarIrradiance: 0,
        carbonOffset: 0,
        annualProduction: 0,
        lifetimeProduction: 0,
        error: insights.error
      };
    }

    return {
      solarIrradiance: insights.maxSunshineHoursPerYear,
      carbonOffset: insights.annualCarbonOffsetKg,
      annualProduction: insights.yearlyEnergyDcKwh,
      lifetimeProduction: insights.lifetimeEnergyDcKwh,
    };
  }

  async getPanelsByVendor(vendorName: string, region: string): Promise<Panel[]> {
    const { data, error } = await supabase
      .from("panels")
      .select("*")
      .eq("vendor_name", vendorName)
      .eq("region", region);

    if (error) throw new Error(`Failed to fetch panels: ${error.message}`);
    
    // Transform database records to Panel type
    return data.map(panel => ({
      ...panel,
      dimensions: panel.dimensions as Panel['dimensions'],
      warranty: panel.warranty as Panel['warranty']
    }));
  }

  optimizePanels(panels: Panel[], roofArea: number, targetSystemSize: number): OptimizedPanels {
    panels.sort((a, b) => b.efficiency - a.efficiency);
    const selectedPanels = [];
    let totalPower = 0;

    for (const panel of panels) {
      const panelArea = panel.dimensions.length * panel.dimensions.width;
      const maxPanels = Math.floor(roofArea / panelArea);

      for (let i = 0; i < maxPanels; i++) {
        selectedPanels.push(panel);
        totalPower += panel.rated_power;
        roofArea -= panelArea;

        if (totalPower >= targetSystemSize * 1000) break;
      }
      if (totalPower >= targetSystemSize * 1000) break;
    }

    return {
      selectedPanels,
      totalPower: `${(totalPower / 1000).toFixed(2)}`
    };
  }

  async calculateInstallationCosts(region: string, selectedPanels: Panel[], laborHours: number) {
    const { data: costs, error } = await supabase
      .from("installation_costs")
      .select("*")
      .eq("region", region)
      .single();

    if (error) throw new Error(`Failed to fetch installation costs: ${error.message}`);

    const panelCost = selectedPanels.reduce((sum, panel) => sum + panel.price, 0);
    const laborCost = laborHours * costs.labor_cost;
    const mountingCost = costs.local_installation_cost;

    return panelCost + laborCost + mountingCost;
  }

  async getAddonsByType(type: string) {
    const { data, error } = await supabase
      .from("addons")
      .select("*")
      .eq("addon_type", type);

    if (error) throw new Error(`Failed to fetch add-ons: ${error.message}`);
    return data;
  }

  calculateROI(totalCost: number, annualSavings: number, discountRate: number, lifespan: number): ROIMetrics {
    const paybackPeriod = this.calculatePaybackPeriod(totalCost, annualSavings);
    const npv = this.calculateNPV(totalCost, annualSavings, discountRate, lifespan);
    const irr = this.calculateIRR(totalCost, annualSavings, lifespan);

    return {
      paybackPeriod,
      npv,
      irr
    };
  }

  private calculatePaybackPeriod(totalCost: number, annualSavings: number): string {
    return (totalCost / annualSavings).toFixed(1);
  }

  private calculateNPV(totalCost: number, annualSavings: number, discountRate: number, lifespan: number): string {
    const npv = Array.from({ length: lifespan }, (_, i) =>
      annualSavings / Math.pow(1 + discountRate, i + 1)
    ).reduce((acc, value) => acc + value, -totalCost);
    return npv.toFixed(2);
  }

  private calculateIRR(totalCost: number, annualSavings: number, lifespan: number): string {
    let irr = 0.1;
    let iteration = 0;
    while (iteration < 100) {
      const npv = Array.from({ length: lifespan }, (_, i) =>
        annualSavings / Math.pow(1 + irr, i + 1)
      ).reduce((acc, value) => acc + value, -totalCost);

      if (Math.abs(npv) < 0.01) break;
      irr += npv > 0 ? 0.001 : -0.001;
      iteration++;
    }
    return (irr * 100).toFixed(2);
  }
}

// Create and export a singleton instance
export const solarAPI = new SolarAPI(process.env.GOOGLE_MAPS_API_KEY || '');