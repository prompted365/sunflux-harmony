export interface IrradianceData {
  maxSunshineHours?: number;
  carbonOffset?: number;
  monthlyProduction?: {
    [key: string]: number;
  };
}