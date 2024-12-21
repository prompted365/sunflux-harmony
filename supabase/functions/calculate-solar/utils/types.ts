export interface BuildingInsightsResponse {
  name: string;
  center: LatLng;
  imageryDate: Date;
  postalCode: string;
  administrativeArea: string;
  statisticalArea: string;
  regionCode: string;
  solarPotential: SolarPotential;
  imageryQuality: string;
}

export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface SolarPotential {
  maxArrayPanelsCount: number;
  panelCapacityWatts: number;
  maxArrayAreaMeters2: number;
  maxSunshineHoursPerYear: number;
  carbonOffsetFactorKgPerMwh: number;
  wholeRoofStats: SizeAndSunshineStats;
  roofSegmentStats: RoofSegmentSizeAndSunshineStats[];
  solarPanelConfigs: SolarPanelConfig[];
  financialAnalyses: FinancialAnalysis[];
  panelHeightMeters: number;
  panelWidthMeters: number;
}

export interface SizeAndSunshineStats {
  areaMeters2: number;
  sunshineQuantiles: number[];
  groundAreaMeters2: number;
}

export interface RoofSegmentSizeAndSunshineStats {
  stats: SizeAndSunshineStats;
  center: LatLng;
  pitchDegrees: number;
  azimuthDegrees: number;
  planeHeightAtCenterMeters: number;
}

export interface SolarPanelConfig {
  panelsCount: number;
  yearlyEnergyDcKwh: number;
  roofSegmentSummaries: RoofSegmentSummary[];
}

export interface RoofSegmentSummary {
  pitchDegrees: number;
  azimuthDegrees: number;
  panelsCount: number;
  yearlyEnergyDcKwh: number;
  segmentIndex: number;
}

export interface FinancialAnalysis {
  monthlyBill: Money;
  financialDetails: FinancialDetails;
  cashPurchaseSavings?: CashPurchaseSavings;
}

export interface Money {
  currencyCode: string;
  units: string;
  nanos: number;
}

export interface FinancialDetails {
  costOfElectricityWithoutSolar: Money;
  federalIncentive: Money;
  lifetimeSrecTotal: Money;
}

export interface CashPurchaseSavings {
  paybackYears: number;
}