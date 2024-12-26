import { Json } from './auth'

export interface DataLayer {
  id: string
  calculation_id: string
  imagery_date: string | null
  imagery_processed_date: string | null
  dsm_url: string | null
  rgb_url: string | null
  mask_url: string | null
  annual_flux_url: string | null
  monthly_flux_url: string | null
  hourly_shade_urls: string[] | null
  imagery_quality: string | null
  raw_response: Json | null
  created_at: string
  processed_at: string | null
}

export interface Report {
  id: string
  calculation_id: string
  file_path: string
  created_at: string
}