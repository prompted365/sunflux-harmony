import { Profile, VendorProfile } from '@/types/supabase/auth';
import { Property, PropertyDetails } from '@/types/supabase/property';
import { SolarCalculation, SolarConfiguration } from '@/types/supabase/solar';
import { DataLayer, Report } from '@/types/supabase/data';
import { ROIResult, ClientUsage, InstallationCost } from '@/types/supabase/financial';
import { 
  VendorIntegration, 
  IntegrationFeatureVote, 
  Panel, 
  Addon, 
  Incentive 
} from '@/types/supabase/vendor';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Profile>
      }
      vendor_profiles: {
        Row: VendorProfile
        Insert: Omit<VendorProfile, 'created_at' | 'updated_at'>
        Update: Partial<VendorProfile>
      }
      properties: {
        Row: Property
        Insert: Omit<Property, 'created_at' | 'updated_at'>
        Update: Partial<Property>
      }
      solar_calculations: {
        Row: SolarCalculation
        Insert: Omit<SolarCalculation, 'created_at' | 'updated_at'>
        Update: Partial<SolarCalculation>
      }
      solar_configurations: {
        Row: SolarConfiguration
        Insert: Omit<SolarConfiguration, 'created_at' | 'updated_at'>
        Update: Partial<SolarConfiguration>
      }
      data_layers: {
        Row: DataLayer
        Insert: Omit<DataLayer, 'created_at'>
        Update: Partial<DataLayer>
      }
      reports: {
        Row: Report
        Insert: Omit<Report, 'created_at'>
        Update: Partial<Report>
      }
      roi_results: {
        Row: ROIResult
        Insert: Omit<ROIResult, 'created_at' | 'updated_at'>
        Update: Partial<ROIResult>
      }
      client_usage: {
        Row: ClientUsage
        Insert: Omit<ClientUsage, 'created_at' | 'updated_at'>
        Update: Partial<ClientUsage>
      }
      vendor_integrations: {
        Row: VendorIntegration
        Insert: Omit<VendorIntegration, 'created_at' | 'updated_at'>
        Update: Partial<VendorIntegration>
      }
      integration_feature_votes: {
        Row: IntegrationFeatureVote
        Insert: Omit<IntegrationFeatureVote, 'created_at'>
        Update: Partial<IntegrationFeatureVote>
      }
      panels: {
        Row: Panel
        Insert: Omit<Panel, 'created_at' | 'updated_at'>
        Update: Partial<Panel>
      }
      addons: {
        Row: Addon
        Insert: Omit<Addon, 'created_at' | 'updated_at'>
        Update: Partial<Addon>
      }
      incentives: {
        Row: Incentive
        Insert: Omit<Incentive, 'created_at' | 'updated_at'>
        Update: Partial<Incentive>
      }
      installation_costs: {
        Row: InstallationCost
        Insert: Omit<InstallationCost, 'created_at' | 'updated_at'>
        Update: Partial<InstallationCost>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Re-export all types for convenience
export type {
  Profile,
  VendorProfile,
  Property,
  PropertyDetails,
  SolarCalculation,
  SolarConfiguration,
  DataLayer,
  Report,
  ROIResult,
  ClientUsage,
  InstallationCost,
  VendorIntegration,
  IntegrationFeatureVote,
  Panel,
  Addon,
  Incentive
};