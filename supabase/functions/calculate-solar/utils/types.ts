// GeoTIFF Types
export interface GeoTiff {
  width: number;
  height: number;
  rasters: Array<number>[];
  bounds: Bounds;
}

export interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface PaletteOptions {
  data: GeoTiff;
  mask?: GeoTiff;
  colors?: string[];
  min?: number;
  max?: number;
  index?: number;
}

// Google Solar API Types
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
  panelConfigIndex: number;
  financialDetails: FinancialDetails;
  leasingSavings?: LeasingSavings;
  cashPurchaseSavings?: CashPurchaseSavings;
  financedPurchaseSavings?: FinancedPurchaseSavings;
}

export interface Money {
  currencyCode: string;
  units: string;
  nanos: number;
}

export interface FinancialDetails {
  initialAcKwhPerYear: number;
  remainingLifetimeUtilityBill: Money;
  federalIncentive: Money;
  stateIncentive: Money;
  utilityIncentive: Money;
  lifetimeSrecTotal: Money;
  costOfElectricityWithoutSolar: Money;
  netMeteringAllowed: boolean;
  solarPercentage: number;
  percentageExportedToGrid: number;
}

export interface LeasingSavings {
  leasesAllowed: boolean;
  leasesSupported: boolean;
  annualLeasingCost: Money;
  savings: SavingsOverTime;
}

export interface CashPurchaseSavings {
  outOfPocketCost: Money;
  upfrontCost: Money;
  rebateValue: Money;
  paybackYears: number;
  savings: SavingsOverTime;
}

export interface FinancedPurchaseSavings {
  annualLoanPayment: Money;
  rebateValue: Money;
  loanInterestRate: number;
  savings: SavingsOverTime;
}

export interface SavingsOverTime {
  savingsYear1: Money;
  savingsYear20: Money;
  presentValueOfSavingsYear20: Money;
  savingsLifetime: Money;
  presentValueOfSavingsLifetime: Money;
  financiallyViable: boolean;
}

// Data Layers Types
export interface DataLayersResponse {
  imageryDate: Date;
  imageryProcessedDate: Date;
  dsmUrl: string;
  rgbUrl: string;
  maskUrl: string;
  annualFluxUrl: string;
  monthlyFluxUrl: string;
  hourlyShadeUrls: string[];
  imageryQuality: string;
}