import { Json } from "@/integrations/supabase/types";

export interface SolarCalculation {
  id: string;
  status: string;
  system_size: number | null;
  irradiance_data: IrradianceData | null;
  panel_layout: PanelLayout | null;
  estimated_production: EstimatedProduction | null;
  financial_analysis: FinancialAnalysis | null;
  building_specs: BuildingSpecs | null;
  property?: PropertyData;
}

export interface PropertyData {
  address: string;
  city: string;
  state: string;
  zip_code: string;
}
