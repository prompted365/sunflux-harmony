import { Json } from "./common";

export interface Property {
  id: string;
  user_id: string;
  vendor_id: string | null;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  latitude: number | null;
  longitude: number | null;
  status: string | null;
  DSM: string | null;
  RGB: string | null;
  Mask: string | null;
  AnnualFlux: string | null;
  FluxOverRGB: string | null;
  MonthlyFluxCompositeGIF: string | null;
  MonthlyFlux12: string[] | null;
  MonthlyFluxComposites: string[] | null;
  building_insights_jsonb: Json | null;
  latest_imagery_folder: string | null;
  created_at: string;
  updated_at: string;
}