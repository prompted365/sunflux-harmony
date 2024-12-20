import { Json } from "@/integrations/supabase/types";
import { SolarCalculation } from "./calculations";

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

// Type guard to ensure JSON data matches our expected types
export function isValidSolarCalculation(data: any): data is SolarCalculation {
  return (
    data &&
    typeof data.id === 'string' &&
    typeof data.status === 'string' &&
    (data.system_size === null || typeof data.system_size === 'number') &&
    data.irradiance_data &&
    data.panel_layout &&
    data.estimated_production &&
    data.financial_analysis &&
    data.building_specs
  );
}