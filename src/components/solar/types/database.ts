import { Json } from "@/integrations/supabase/types";

export interface DatabaseSolarCalculation {
  id: string;
  status: string;
  system_size: number | null;
  irradiance_data: Json;
  panel_layout: Json;
  estimated_production: Json;
  financial_analysis: Json;
  panel_config: Json;
  building_specs: Json;
}