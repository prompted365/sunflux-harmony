import { Json } from "@/integrations/supabase/types";
import { BuildingSpecs } from "./types/imagery";

export interface SolarCalculation {
  id: string;
  status: string;
  system_size: number | null;
  irradiance_data: {
    maxSunshineHours: number;
    carbonOffset: number;
  } | null;
  panel_layout: {
    maxPanels: number;
    maxArea: number;
    panelDimensions: {
      height: number;
      width: number;
    };
  } | null;
  estimated_production: {
    yearlyEnergyDcKwh: number;
  } | null;
  financial_analysis: {
    initialCost: number;
    federalIncentive: number;
    monthlyBillSavings: number;
    paybackYears: number;
  } | null;
  building_specs: BuildingSpecs | null;
}