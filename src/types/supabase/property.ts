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
  created_at: string;
  updated_at: string;
}

export interface PropertyDetails {
  id: string;
  user_id: string;
  address: string;
  latitude: number;
  longitude: number;
  roof_area: number;
  roof_tilt: number | null;
  shading: any | null;
  created_at: string;
  updated_at: string;
}

export type PropertyInsert = Omit<Property, 'id' | 'created_at' | 'updated_at'>;
export type PropertyUpdate = Partial<PropertyInsert>;