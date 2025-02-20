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
          category: string | null
          compatibility_specs: Json | null
          cost: number
          created_at: string
          description: string | null
          efficiency_rating: number | null
          id: number
          installation_requirements: Json | null
          manufacturer: string | null
          model_number: string | null
          updated_at: string
          vendor_id: string | null
          warranty_years: number | null
        }
        Insert: {
          addon_type: string
          capacity?: number | null
          category?: string | null
          compatibility_specs?: Json | null
          cost: number
          created_at?: string
          description?: string | null
          efficiency_rating?: number | null
          id?: number
          installation_requirements?: Json | null
          manufacturer?: string | null
          model_number?: string | null
          updated_at?: string
          vendor_id?: string | null
          warranty_years?: number | null
        }
        Update: {
          addon_type?: string
          capacity?: number | null
          category?: string | null
          compatibility_specs?: Json | null
          cost?: number
          created_at?: string
          description?: string | null
          efficiency_rating?: number | null
          id?: number
          installation_requirements?: Json | null
          manufacturer?: string | null
          model_number?: string | null
          updated_at?: string
          vendor_id?: string | null
          warranty_years?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "addons_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      financing_options: {
        Row: {
          calculation_id: string | null
          created_at: string
          id: string
          interest_rate_percentage: number | null
          loan_amount_usd: number | null
          loan_term_years: number | null
          monthly_repayment_usd: number | null
          updated_at: string
        }
        Insert: {
          calculation_id?: string | null
          created_at?: string
          id?: string
          interest_rate_percentage?: number | null
          loan_amount_usd?: number | null
          loan_term_years?: number | null
          monthly_repayment_usd?: number | null
          updated_at?: string
        }
        Update: {
          calculation_id?: string | null
          created_at?: string
          id?: string
          interest_rate_percentage?: number | null
          loan_amount_usd?: number | null
          loan_term_years?: number | null
          monthly_repayment_usd?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "financing_options_calculation_id_fkey"
            columns: ["calculation_id"]
            isOneToOne: false
            referencedRelation: "solar_calculations"
            referencedColumns: ["id"]
          },
        ]
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
          equipment_cost: number | null
          id: number
          installation_cost_model: string
          labor_cost: number
          local_installation_cost: number
          maximum_project_size: number | null
          minimum_project_size: number | null
          mounting_system_type: string
          overhead_cost: number | null
          permit_cost: number | null
          profit_margin: number | null
          region: string
          roof_type_multiplier: Json | null
          updated_at: string
          vendor_id: string | null
        }
        Insert: {
          created_at?: string
          equipment_cost?: number | null
          id?: number
          installation_cost_model: string
          labor_cost: number
          local_installation_cost: number
          maximum_project_size?: number | null
          minimum_project_size?: number | null
          mounting_system_type: string
          overhead_cost?: number | null
          permit_cost?: number | null
          profit_margin?: number | null
          region: string
          roof_type_multiplier?: Json | null
          updated_at?: string
          vendor_id?: string | null
        }
        Update: {
          created_at?: string
          equipment_cost?: number | null
          id?: number
          installation_cost_model?: string
          labor_cost?: number
          local_installation_cost?: number
          maximum_project_size?: number | null
          minimum_project_size?: number | null
          mounting_system_type?: string
          overhead_cost?: number | null
          permit_cost?: number | null
          profit_margin?: number | null
          region?: string
          roof_type_multiplier?: Json | null
          updated_at?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "installation_costs_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_profiles"
            referencedColumns: ["id"]
          },
        ]
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
      processing_jobs: {
        Row: {
          calculation_id: string
          created_at: string
          error_message: string | null
          id: string
          status: string
          updated_at: string
        }
        Insert: {
          calculation_id: string
          created_at?: string
          error_message?: string | null
          id?: string
          status?: string
          updated_at?: string
        }
        Update: {
          calculation_id?: string
          created_at?: string
          error_message?: string | null
          id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "processing_jobs_calculation_id_fkey"
            columns: ["calculation_id"]
            isOneToOne: false
            referencedRelation: "solar_calculations"
            referencedColumns: ["id"]
          },
        ]
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
          building_stats: Json | null
          created_at: string
          estimated_production: Json | null
          financial_analysis: Json | null
          financial_metrics: Json | null
          id: string
          installation_specs: Json | null
          irradiance_data: Json | null
          panel_config: Json | null
          panel_layout: Json | null
          property_id: string
          status: string
          system_size: number | null
          updated_at: string
          utility_context: Json | null
        }
        Insert: {
          building_specs?: Json | null
          building_stats?: Json | null
          created_at?: string
          estimated_production?: Json | null
          financial_analysis?: Json | null
          financial_metrics?: Json | null
          id?: string
          installation_specs?: Json | null
          irradiance_data?: Json | null
          panel_config?: Json | null
          panel_layout?: Json | null
          property_id: string
          status?: string
          system_size?: number | null
          updated_at?: string
          utility_context?: Json | null
        }
        Update: {
          building_specs?: Json | null
          building_stats?: Json | null
          created_at?: string
          estimated_production?: Json | null
          financial_analysis?: Json | null
          financial_metrics?: Json | null
          id?: string
          installation_specs?: Json | null
          irradiance_data?: Json | null
          panel_config?: Json | null
          panel_layout?: Json | null
          property_id?: string
          status?: string
          system_size?: number | null
          updated_at?: string
          utility_context?: Json | null
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
      solar_configurations: {
        Row: {
          created_at: string
          energy_cost_per_kwh: number
          id: string
          is_using_defaults: boolean | null
          monthly_bill: number | null
          property_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          energy_cost_per_kwh: number
          id?: string
          is_using_defaults?: boolean | null
          monthly_bill?: number | null
          property_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          energy_cost_per_kwh?: number
          id?: string
          is_using_defaults?: boolean | null
          monthly_bill?: number | null
          property_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "solar_configurations_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_incentives: {
        Row: {
          administrative_area: string | null
          calculation_id: string | null
          carbon_offset_value_usd: number | null
          created_at: string
          federal_credit_usd: number | null
          id: string
          region_code: string | null
          state_incentives_usd: number | null
          statistical_area: string | null
          total_incentives_usd: number | null
          updated_at: string
        }
        Insert: {
          administrative_area?: string | null
          calculation_id?: string | null
          carbon_offset_value_usd?: number | null
          created_at?: string
          federal_credit_usd?: number | null
          id?: string
          region_code?: string | null
          state_incentives_usd?: number | null
          statistical_area?: string | null
          total_incentives_usd?: number | null
          updated_at?: string
        }
        Update: {
          administrative_area?: string | null
          calculation_id?: string | null
          carbon_offset_value_usd?: number | null
          created_at?: string
          federal_credit_usd?: number | null
          id?: string
          region_code?: string | null
          state_incentives_usd?: number | null
          statistical_area?: string | null
          total_incentives_usd?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tax_incentives_calculation_id_fkey"
            columns: ["calculation_id"]
            isOneToOne: false
            referencedRelation: "solar_calculations"
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
          business_address: string | null
          business_description: string | null
          bypass_trial_limits: boolean | null
          communication_opt_in: boolean | null
          created_at: string
          id: string
          logo_url: string | null
          phone: string | null
          primary_color: string | null
          secondary_color: string | null
          service_regions: string[] | null
          solar_specialties: string[] | null
          trial_reports_remaining: number | null
          trial_reports_reset_date: string | null
          updated_at: string
          vendor_name: string | null
          website_url: string | null
          year_established: number | null
        }
        Insert: {
          account_tier?: string | null
          business_address?: string | null
          business_description?: string | null
          bypass_trial_limits?: boolean | null
          communication_opt_in?: boolean | null
          created_at?: string
          id: string
          logo_url?: string | null
          phone?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          service_regions?: string[] | null
          solar_specialties?: string[] | null
          trial_reports_remaining?: number | null
          trial_reports_reset_date?: string | null
          updated_at?: string
          vendor_name?: string | null
          website_url?: string | null
          year_established?: number | null
        }
        Update: {
          account_tier?: string | null
          business_address?: string | null
          business_description?: string | null
          bypass_trial_limits?: boolean | null
          communication_opt_in?: boolean | null
          created_at?: string
          id?: string
          logo_url?: string | null
          phone?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          service_regions?: string[] | null
          solar_specialties?: string[] | null
          trial_reports_remaining?: number | null
          trial_reports_reset_date?: string | null
          updated_at?: string
          vendor_name?: string | null
          website_url?: string | null
          year_established?: number | null
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
      bytea_to_text: {
        Args: {
          data: string
        }
        Returns: string
      }
      http: {
        Args: {
          request: Database["public"]["CompositeTypes"]["http_request"]
        }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_delete:
        | {
            Args: {
              uri: string
            }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
          }
        | {
            Args: {
              uri: string
              content: string
              content_type: string
            }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
          }
      http_get:
        | {
            Args: {
              uri: string
            }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
          }
        | {
            Args: {
              uri: string
              data: Json
            }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
          }
      http_head: {
        Args: {
          uri: string
        }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_header: {
        Args: {
          field: string
          value: string
        }
        Returns: Database["public"]["CompositeTypes"]["http_header"]
      }
      http_list_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: {
          curlopt: string
          value: string
        }[]
      }
      http_patch: {
        Args: {
          uri: string
          content: string
          content_type: string
        }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_post:
        | {
            Args: {
              uri: string
              content: string
              content_type: string
            }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
          }
        | {
            Args: {
              uri: string
              data: Json
            }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
          }
      http_put: {
        Args: {
          uri: string
          content: string
          content_type: string
        }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_reset_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      http_set_curlopt: {
        Args: {
          curlopt: string
          value: string
        }
        Returns: boolean
      }
      text_to_bytea: {
        Args: {
          data: string
        }
        Returns: string
      }
      urlencode:
        | {
            Args: {
              data: Json
            }
            Returns: string
          }
        | {
            Args: {
              string: string
            }
            Returns: string
          }
        | {
            Args: {
              string: string
            }
            Returns: string
          }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      http_header: {
        field: string | null
        value: string | null
      }
      http_request: {
        method: unknown | null
        uri: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content_type: string | null
        content: string | null
      }
      http_response: {
        status: number | null
        content_type: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content: string | null
      }
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
