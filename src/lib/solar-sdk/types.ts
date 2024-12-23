export interface BuildingInsights {
  roofArea: number;
  roofTilt: number;
  shading: number;
  yearlyEnergyDcKwh: number;
  lifetimeEnergyDcKwh: number;
  annualCarbonOffsetKg: number;
  maxSunshineHoursPerYear: number;
  solarPotential?: {
    buildingStats?: {
      areaMeters2: number;
      sunshineQuantiles: number[];
      groundAreaMeters2: number;
    };
  };
}

export interface EnvironmentalAnalysis {
  solarIrradiance: number;
  carbonOffset: number;
  annualProduction: number;
  lifetimeProduction: number;
}

export interface Panel {
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  capacity: number;
  efficiency: number;
  price: number;
}

export interface OptimizedPanels {
  selectedPanels: Panel[];
  totalPower: string;
}

export interface ROIMetrics {
  paybackPeriod: number;
  npv: number;
  irr: number;
}