export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  status: string | null;
  building_insights_jsonb?: any;
  latest_imagery_folder?: string | null;
  imagery_processed_at?: string | null;
  imagery_status?: string | null;
  DSM?: string | null;
  RGB?: string | null;
  Mask?: string | null;
  AnnualFlux?: string | null;
  FluxOverRGB?: string | null;
  MonthlyFluxCompositeGIF?: string | null;
  MonthlyFlux12?: string[] | null;
  MonthlyFluxComposites?: string[] | null;
  solar_calculations?: Array<{
    id: string;
    status: string;
    system_size: number;
    panel_layout: any;
    estimated_production: any;
    building_specs: any;
  }>;
}

export interface ImageryResponse {
  success: boolean;
  urls: Record<string, string | string[]>;
  status: string;
  property: Property;
}