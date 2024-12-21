import { Json } from "@/integrations/supabase/types";

// Core calculation types
export interface IrradianceData {
  maxSunshineHours: number;
  carbonOffset: number;
  annualSunlight?: number;
}

export interface PanelLayout {
  maxPanels: number;
  maxArea: number;
  panelDimensions: {
    height: number;
    width: number;
  };
  optimalConfiguration?: {
    panelCount: number;
    yearlyEnergy: number;
    segments?: any[];
  };
}

export interface EstimatedProduction {
  yearlyEnergyDcKwh: number | null;
  monthlyBill: string | null;
  financialDetails?: {
    initialCost: number | null;
    federalIncentive: number | null;
    monthlyBillSavings: number | null;
    paybackYears: number | null;
    lifetimeSavings: number | null;
    firstYearSavings: number | null;
  };
  environmentalImpact?: {
    carbonOffset: number;
    treesEquivalent: number;
    homesEquivalent: number;
  };
}

export interface FinancialAnalysis {
  initialCost: number;
  federalIncentive: number;
  monthlyBillSavings: number;
  paybackYears: number;
}

export interface BuildingSpecs {
  address?: string;
  imagery?: {
    rgb?: string;
    dsm?: string;
    mask?: string;
    annualFlux?: string;
    monthlyFlux?: string;
  };
}

export interface SolarCalculation {
  id: string;
  status: string;
  system_size: number | null;
  irradiance_data: IrradianceData | null;
  panel_layout: PanelLayout | null;
  estimated_production: EstimatedProduction | null;
  financial_analysis: FinancialAnalysis | null;
  building_specs: BuildingSpecs | null;
}

// Database types
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

// Type guard
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