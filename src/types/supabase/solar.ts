import { Json } from './auth'

export interface SolarCalculation {
  id: string
  property_id: string
  status: string
  irradiance_data: Json | null
  panel_layout: Json | null
  system_size: number | null
  estimated_production: Json | null
  created_at: string
  updated_at: string
  financial_analysis: Json | null
  panel_config: Json | null
  building_specs: Json | null
}

export interface SolarConfiguration {
  id: string
  property_id: string
  monthly_bill: number | null
  energy_cost_per_kwh: number | null
  panel_capacity_watts: number | null
  panel_height_meters: number | null
  panel_width_meters: number | null
  installation_cost_per_watt: number | null
  is_using_defaults: boolean | null
  created_at: string
  updated_at: string
  visible_layers: Json | null
}

export interface Panel {
  id: number
  panel_model: string
  vendor_name: string
  region: string
  rated_power: number
  efficiency: number
  dimensions: Json
  degradation_rate: number
  warranty: Json
  price: number
  shipping_cost: number
  created_at: string
  updated_at: string
}