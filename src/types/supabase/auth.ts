export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Auth and profile related types
export interface Profile {
  id: string
  full_name: string | null
  company: string | null
  phone: string | null
  created_at: string
  updated_at: string
}

export interface VendorProfile {
  id: string
  company_name: string | null
  logo_url: string | null
  primary_color: string | null
  secondary_color: string | null
  created_at: string
  updated_at: string
  trial_reports_remaining: number | null
  trial_reports_reset_date: string | null
  communication_opt_in: boolean | null
  account_tier: string | null
  bypass_trial_limits: boolean | null
}