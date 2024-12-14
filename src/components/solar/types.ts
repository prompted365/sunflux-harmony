import { Json } from "@/integrations/supabase/types";

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
}

export interface DatabaseSolarCalculation {
  id: string;
  status: string;
  system_size: number | null;
  irradiance_data: Json;
  panel_layout: Json;
  estimated_production: Json;
}