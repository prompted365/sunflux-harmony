export interface BuildingInsights {
  roofArea: number;
  roofTilt: number;
  shading: number;
  yearlyEnergyDcKwh: number;
  lifetimeEnergyDcKwh: number;
  annualCarbonOffsetKg: number;
  maxSunshineHoursPerYear: number;
  error?: string;
}

export interface EnvironmentalAnalysis {
  solarIrradiance: number;
  carbonOffset: number;
  annualProduction: number;
  lifetimeProduction: number;
  error?: string;
}

export interface Panel {
  id: number;
  panel_model: string;
  vendor_name: string;
  region: string;
  rated_power: number;
  efficiency: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  degradation_rate: number;
  warranty: {
    performance: number;
    product: number;
  };
  price: number;
  shipping_cost: number;
}

export interface OptimizedPanels {
  selectedPanels: Panel[];
  totalPower: string;
}

export interface ROIMetrics {
  paybackPeriod: string;
  npv: string;
  irr: string;
}