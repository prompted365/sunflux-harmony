import { SolarCalculation } from "@/components/solar/types";

export interface DatabaseSolarCalculation {
  id: string;
  status: string;
  system_size: number | null;
  irradiance_data: any;
  panel_layout: any;
  estimated_production: any;
  financial_analysis: any;
  panel_config: any;
  building_specs: any;
  properties: {
    address: string;
    city: string;
    state: string;
    zip_code: string;
  };
}

export interface TransformedCalculation extends SolarCalculation {
  properties: {
    address: string;
    city: string;
    state: string;
    zip_code: string;
  };
}