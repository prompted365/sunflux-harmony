export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  status: string | null;
  solar_calculations?: Array<{
    id: string;
    status: string;
    system_size: number;
    panel_layout: any;
    estimated_production: any;
    building_specs: any;
  }>;
}