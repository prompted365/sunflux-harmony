import { Json } from "./common";

export interface SolarCalculation {
  id: string;
  property_id: string;
  status: string;
  irradiance_data: Json | null;
  panel_layout: Json | null;
  system_size: number | null;
  estimated_production: Json | null;
  created_at: string;
  updated_at: string;
  financial_analysis: Json | null;
  panel_config: Json | null;
  building_specs: Json | null;
}

export interface ProcessingJob {
  id: string;
  calculation_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface SolarConfiguration {
  id: string;
  property_id: string;
  monthly_bill: number | null;
  energy_cost_per_kwh: number;
  is_using_defaults: boolean | null;
  created_at: string;
  updated_at: string;
}