export interface BuildingSpecs {
  address?: string;
  roofArea?: number;
  azimuth?: number;
  pitch?: number;
  imagery?: {
    rgb?: string;
    dsm?: string;
    annualFlux?: string;
  };
}