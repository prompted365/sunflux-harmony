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
      data_layers: {
        Row: {
          annual_flux_url: string | null
          calculation_id: string
          created_at: string
          dsm_url: string | null
          hourly_shade_urls: string[] | null
          id: string
          imagery_date: string | null
          imagery_processed_date: string | null
          imagery_quality: string | null
          mask_url: string | null
          monthly_flux_url: string | null
          processed_at: string | null
          raw_response: Json | null
          rgb_url: string | null
        }
        Insert: {
          annual_flux_url?: string | null
          calculation_id: string
          created_at?: string
          dsm_url?: string | null
          hourly_shade_urls?: string[] | null
          id?: string
          imagery_date?: string | null
          imagery_processed_date?: string | null
          imagery_quality?: string | null
          mask_url?: string | null
          monthly_flux_url?: string | null
          processed_at?: string | null
          raw_response?: Json | null
          rgb_url?: string | null
        }
        Update: {
          annual_flux_url?: string | null
          calculation_id?: string
          created_at?: string
          dsm_url?: string | null
          hourly_shade_urls?: string[] | null
          id?: string
          imagery_date?: string | null
          imagery_processed_date?: string | null
          imagery_quality?: string | null
          mask_url?: string | null
          monthly_flux_url?: string | null
          processed_at?: string | null
          raw_response?: Json | null
          rgb_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "data_layers_calculation_id_fkey"
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
          city: string
          created_at: string
          id: string
          latitude: number | null
          longitude: number | null
          state: string
          updated_at: string
          user_id: string
          zip_code: string
        }
        Insert: {
          address: string
          city: string
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          state: string
          updated_at?: string
          user_id: string
          zip_code: string
        }
        Update: {
          address?: string
          city?: string
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          state?: string
          updated_at?: string
          user_id?: string
          zip_code?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          calculation_id: string
          created_at: string
          file_path: string
          id: string
        }
        Insert: {
          calculation_id: string
          created_at?: string
          file_path: string
          id?: string
        }
        Update: {
          calculation_id?: string
          created_at?: string
          file_path?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_calculation_id_fkey"
            columns: ["calculation_id"]
            isOneToOne: false
            referencedRelation: "solar_calculations"
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
      solar_configurations: {
        Row: {
          created_at: string
          energy_cost_per_kwh: number | null
          id: string
          installation_cost_per_watt: number | null
          is_using_defaults: boolean | null
          monthly_bill: number | null
          panel_capacity_watts: number | null
          panel_height_meters: number | null
          panel_width_meters: number | null
          property_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          energy_cost_per_kwh?: number | null
          id?: string
          installation_cost_per_watt?: number | null
          is_using_defaults?: boolean | null
          monthly_bill?: number | null
          panel_capacity_watts?: number | null
          panel_height_meters?: number | null
          panel_width_meters?: number | null
          property_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          energy_cost_per_kwh?: number | null
          id?: string
          installation_cost_per_watt?: number | null
          is_using_defaults?: boolean | null
          monthly_bill?: number | null
          panel_capacity_watts?: number | null
          panel_height_meters?: number | null
          panel_width_meters?: number | null
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
