export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  latitude: number;
  longitude: number;
  vendor_id: string | null;
  user_id: string;
  status: string;
  imagery_status: string | null;
  imagery_processed_at: string | null;
  created_at: string;
  updated_at: string;
  solar_calculations?: SolarCalculation[];
}

export interface SolarCalculation {
  id: string;
  property_id: string;
  status: 'pending' | 'processing' | 'completed';
  system_size?: number;
  created_at: string;
  updated_at: string;
}

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
}
