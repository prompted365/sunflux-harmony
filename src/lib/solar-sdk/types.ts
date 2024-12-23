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
