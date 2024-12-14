export interface SolarCalculation {
  id: string;
  status: string;
  system_size: number | null;
  irradiance_data: {
    maxSunshineHours: number;
    carbonOffset: number;
  } | null;
  panel_layout: {
    maxPanels: number;
    maxArea: number;
    panelDimensions: {
      height: number;
      width: number;
    };
  } | null;
  estimated_production: {
    yearlyEnergyDcKwh: number;
  } | null;
  financial_analysis: {
    totalCost: number;
    federalIncentive: number;
    monthlyBillSavings: number;
    paybackYears: number;
    lifetimeSavings: number;
  } | null;
  panel_config: {
    capacityWatts: number;
    dimensions: {
      height: number;
      width: number;
    };
    lifetimeYears: number;
  } | null;
  building_specs: {
    imageryDate: {
      year: number;
      month: number;
      day: number;
    };
    imagery: {
      dsm: string | null;
      rgb: string | null;
      mask: string | null;
      annualFlux: string | null;
      monthlyFlux: string | null;
    };
  } | null;
}