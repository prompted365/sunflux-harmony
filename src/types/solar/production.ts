export interface EstimatedProduction {
  yearlyEnergyDcKwh?: number;
  monthlyEnergyDcKwh?: {
    [key: string]: number;
  };
  yearlyAcKwh?: number;
}