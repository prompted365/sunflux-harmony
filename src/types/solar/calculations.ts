import { IrradianceData } from './irradiance';
import { PanelLayout, PanelConfig } from './panels';
import { EstimatedProduction } from './production';
import { FinancialAnalysis } from './financial';
import { BuildingSpecs } from './building';

export interface SolarCalculation {
  id: string;
  property_id: string;
  status: string;
  system_size: number | null;
  irradiance_data: IrradianceData | null;
  panel_layout: PanelLayout | null;
  panel_config: PanelConfig | null;
  estimated_production: EstimatedProduction | null;
  financial_analysis: FinancialAnalysis | null;
  building_specs: BuildingSpecs | null;
  created_at: string;
  updated_at: string;
}