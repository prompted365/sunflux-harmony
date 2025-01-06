import { Property } from "../types";

export interface ImageryResponse {
  property: Property;
  urls: {
    DSM?: string;
    RGB?: string;
    Mask?: string;
    AnnualFlux?: string;
    FluxOverRGB?: string;
    MonthlyFluxCompositeGIF?: string;
    MonthlyFlux12?: string[];
    MonthlyFluxComposites?: string[];
  };
  status: string;
  imagery_status: string;
}

export interface ImageItemProps {
  url: string;
  title: string;
}