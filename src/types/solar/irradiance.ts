export interface IrradianceData {
  maxSunshineHours: number; // Making this required to match existing type
  carbonOffset: number; // Making this required to match existing type
  monthlyProduction?: number[];
  annualProduction?: number;
  peakSunHours?: number;
  shading?: number;
}