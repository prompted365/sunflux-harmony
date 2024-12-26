export interface VendorIntegration {
  id: string
  vendor_id: string | null
  platform: string
  location_id: string | null
  private_token: string | null
  created_at: string
  updated_at: string
}

export interface IntegrationFeatureVote {
  id: string
  vendor_id: string | null
  feature_type: string
  created_at: string
}

export interface Addon {
  id: number
  addon_type: string
  cost: number
  capacity: number | null
  created_at: string
  updated_at: string
}