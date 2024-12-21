export interface SolarImagery {
  dsm: string | null;
  rgb: string | null;
  mask: string | null;
  annualFlux: string | null;
  monthlyFlux: string | null;
}

export interface BuildingSpecs {
  imagery: SolarImagery;
  address?: string;
  imageryDate?: {
    year: number;
    month: number;
    day: number;
  };
  imageryQuality?: string;
}