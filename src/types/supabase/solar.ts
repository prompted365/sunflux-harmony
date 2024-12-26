export interface SolarCalculation {
  id: string;
  property_id: string;
  status: string;
  irradiance_data: any | null;
  panel_layout: any | null;
  system_size: number | null;
  estimated_production: any | null;
  financial_analysis: any | null;
  panel_config: any | null;
  building_specs: any | null;
  created_at: string;
  updated_at: string;
}

export interface SolarConfiguration {
  id: string;
  property_id: string;
  monthly_bill: number | null;
  energy_cost_per_kwh: number | null;
  panel_capacity_watts: number | null;
  panel_height_meters: number | null;
  panel_width_meters: number | null;
  installation_cost_per_watt: number | null;
  is_using_defaults: boolean | null;
  visible_layers: any | null;
  created_at: string;
  updated_at: string;
}