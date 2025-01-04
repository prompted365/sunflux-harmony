import { BuildingSpecs } from './imagery';

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