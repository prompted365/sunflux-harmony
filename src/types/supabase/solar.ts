export interface SolarCalculation {
  id: string;
  property_id: string;
  status: string;
  system_size: number | null;
  irradiance_data: any | null;
  panel_layout: any | null;
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
  energy_cost_per_kwh: number;
  panel_capacity_watts: number;
  panel_height_meters: number;
  panel_width_meters: number;
  installation_cost_per_watt: number;
  is_using_defaults: boolean;
  visible_layers: any;
  created_at: string;
  updated_at: string;
}

export type SolarCalculationInsert = Omit<SolarCalculation, 'id' | 'created_at' | 'updated_at'>;
export type SolarConfigurationInsert = Omit<SolarConfiguration, 'id' | 'created_at' | 'updated_at'>;