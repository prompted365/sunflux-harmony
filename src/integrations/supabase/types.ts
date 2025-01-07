export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      addons: {
        Row: {
          addon_type: string
          capacity: number | null
          cost: number
          created_at: string
          id: number
          updated_at: string
        }
        Insert: {
          addon_type: string
          capacity?: number | null
          cost: number
          created_at?: string
          id?: number
          updated_at?: string
        }
        Update: {
          addon_type?: string
          capacity?: number | null
          cost?: number
          created_at?: string
          id?: number
          updated_at?: string
        }
        Relationships: []
      }
      incentives: {
        Row: {
          created_at: string
          expiration_date: string
          id: number
          incentive_type: string
          region: string
          updated_at: string
          value: number
        }
        Insert: {
          created_at?: string
          expiration_date: string
          id?: number
          incentive_type: string
          region: string
          updated_at?: string
          value: number
        }
        Update: {
          created_at?: string
          expiration_date?: string
          id?: number
          incentive_type?: string
          region?: string
          updated_at?: string
          value?: number
        }
        Relationships: []
      }
      installation_costs: {
        Row: {
          created_at: string
          id: number
          installation_cost_model: string
          labor_cost: number
          local_installation_cost: number
          mounting_system_type: string
          region: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          installation_cost_model: string
          labor_cost: number
          local_installation_cost: number
          mounting_system_type: string
          region: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          installation_cost_model?: string
          labor_cost?: number
          local_installation_cost?: number
          mounting_system_type?: string
          region?: string
          updated_at?: string
        }
        Relationships: []
      }
      panels: {
        Row: {
          created_at: string
          degradation_rate: number
          dimensions: Json
          efficiency: number
          id: number
          panel_model: string
          price: number
          rated_power: number
          region: string
          shipping_cost: number
          updated_at: string
          vendor_name: string
          warranty: Json
        }
        Insert: {
          created_at?: string
          degradation_rate: number
          dimensions: Json
          efficiency: number
          id?: number
          panel_model: string
          price: number
          rated_power: number
          region: string
          shipping_cost: number
          updated_at?: string
          vendor_name: string
          warranty: Json
        }
        Update: {
          created_at?: string
          degradation_rate?: number
          dimensions?: Json
          efficiency?: number
          id?: number
          panel_model?: string
          price?: number
          rated_power?: number
          region?: string
          shipping_cost?: number
          updated_at?: string
          vendor_name?: string
          warranty?: Json
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          AnnualFlux: string | null
          building_insights_jsonb: Json | null
          city: string
          created_at: string
          DSM: string | null
          FluxOverRGB: string | null
          id: string
          latest_imagery_folder: string | null
          latitude: number | null
          longitude: number | null
          Mask: string | null
          MonthlyFlux12: string[] | null
          MonthlyFluxCompositeGIF: string | null
          MonthlyFluxComposites: string[] | null
          RGB: string | null
          state: string
          status: string | null
          updated_at: string
          user_id: string
          vendor_id: string | null
          zip_code: string
        }
        Insert: {
          address: string
          AnnualFlux?: string | null
          building_insights_jsonb?: Json | null
          city: string
          created_at?: string
          DSM?: string | null
          FluxOverRGB?: string | null
          id?: string
          latest_imagery_folder?: string | null
          latitude?: number | null
          longitude?: number | null
          Mask?: string | null
          MonthlyFlux12?: string[] | null
          MonthlyFluxCompositeGIF?: string | null
          MonthlyFluxComposites?: string[] | null
          RGB?: string | null
          state: string
          status?: string | null
          updated_at?: string
          user_id: string
          vendor_id?: string | null
          zip_code: string
        }
        Update: {
          address?: string
          AnnualFlux?: string | null
          building_insights_jsonb?: Json | null
          city?: string
          created_at?: string
          DSM?: string | null
          FluxOverRGB?: string | null
          id?: string
          latest_imagery_folder?: string | null
          latitude?: number | null
          longitude?: number | null
          Mask?: string | null
          MonthlyFlux12?: string[] | null
          MonthlyFluxCompositeGIF?: string | null
          MonthlyFluxComposites?: string[] | null
          RGB?: string | null
          state?: string
          status?: string | null
          updated_at?: string
          user_id?: string
          vendor_id?: string | null
          zip_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "properties_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      roi_results: {
        Row: {
          co2_offset: number
          created_at: string
          id: string
          irr: number
          lifetime_production: number
          npv: number
          payback_period: number
          updated_at: string
          user_id: string
        }
        Insert: {
          co2_offset: number
          created_at?: string
          id?: string
          irr: number
          lifetime_production: number
          npv: number
          payback_period: number
          updated_at?: string
          user_id: string
        }
        Update: {
          co2_offset?: number
          created_at?: string
          id?: string
          irr?: number
          lifetime_production?: number
          npv?: number
          payback_period?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "roi_results_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      solar_calculations: {
        Row: {
          building_specs: Json | null
          created_at: string
          estimated_production: Json | null
          financial_analysis: Json | null
          id: string
          irradiance_data: Json | null
          panel_config: Json | null
          panel_layout: Json | null
          property_id: string
          status: string
          system_size: number | null
          updated_at: string
        }
        Insert: {
          building_specs?: Json | null
          created_at?: string
          estimated_production?: Json | null
          financial_analysis?: Json | null
          id?: string
          irradiance_data?: Json | null
          panel_config?: Json | null
          panel_layout?: Json | null
          property_id: string
          status?: string
          system_size?: number | null
          updated_at?: string
        }
        Update: {
          building_specs?: Json | null
          created_at?: string
          estimated_production?: Json | null
          financial_analysis?: Json | null
          id?: string
          irradiance_data?: Json | null
          panel_config?: Json | null
          panel_layout?: Json | null
          property_id?: string
          status?: string
          system_size?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "solar_calculations_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_integrations: {
        Row: {
          created_at: string
          id: string
          location_id: string | null
          platform: string
          private_token: string | null
          updated_at: string
          vendor_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          location_id?: string | null
          platform: string
          private_token?: string | null
          updated_at?: string
          vendor_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          location_id?: string | null
          platform?: string
          private_token?: string | null
          updated_at?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_integrations_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_profiles: {
        Row: {
          account_tier: string | null
          bypass_trial_limits: boolean | null
          communication_opt_in: boolean | null
          company_name: string | null
          created_at: string
          id: string
          logo_url: string | null
          primary_color: string | null
          secondary_color: string | null
          trial_reports_remaining: number | null
          trial_reports_reset_date: string | null
          updated_at: string
        }
        Insert: {
          account_tier?: string | null
          bypass_trial_limits?: boolean | null
          communication_opt_in?: boolean | null
          company_name?: string | null
          created_at?: string
          id: string
          logo_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          trial_reports_remaining?: number | null
          trial_reports_reset_date?: string | null
          updated_at?: string
        }
        Update: {
          account_tier?: string | null
          bypass_trial_limits?: boolean | null
          communication_opt_in?: boolean | null
          company_name?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          trial_reports_remaining?: number | null
          trial_reports_reset_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
