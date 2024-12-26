export interface ROIResult {
  id: string;
  user_id: string;
  payback_period: number;
  npv: number;
  irr: number;
  lifetime_production: number;
  co2_offset: number;
  created_at: string;
  updated_at: string;
}

export interface ClientUsage {
  id: string;
  user_id: string;
  monthly_bill: number;
  annual_consumption: number;
  utility_rate_structure: string;
  created_at: string;
  updated_at: string;
}

export interface InstallationCost {
  id: number;
  region: string;
  installation_cost_model: string;
  local_installation_cost: number;
  mounting_system_type: string;
  labor_cost: number;
  created_at: string;
  updated_at: string;
}