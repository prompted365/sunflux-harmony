export interface VendorProfile {
  id: string;
  company_name: string | null;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  trial_reports_remaining: number | null;
  trial_reports_reset_date: string | null;
  communication_opt_in: boolean;
  account_tier: string;
  bypass_trial_limits: boolean;
  created_at: string;
  updated_at: string;
}

export interface VendorIntegration {
  id: string;
  vendor_id: string | null;
  platform: string;
  location_id: string | null;
  private_token: string | null;
  created_at: string;
  updated_at: string;
}

export interface IntegrationFeatureVote {
  id: string;
  vendor_id: string | null;
  feature_type: string;
  created_at: string;
}

export interface Panel {
  id: number;
  panel_model: string;
  vendor_name: string;
  region: string;
  rated_power: number;
  efficiency: number;
  dimensions: any;
  degradation_rate: number;
  warranty: any;
  price: number;
  shipping_cost: number;
  created_at: string;
  updated_at: string;
}

export interface Addon {
  id: number;
  addon_type: string;
  cost: number;
  capacity: number | null;
  created_at: string;
  updated_at: string;
}

export type VendorProfileInsert = Omit<VendorProfile, 'created_at' | 'updated_at'>;
export type VendorIntegrationInsert = Omit<VendorIntegration, 'id' | 'created_at' | 'updated_at'>;