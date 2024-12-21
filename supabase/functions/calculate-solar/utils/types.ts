export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface DataLayersResponse {
  imageryDate: {
    year: number;
    month: number;
    day: number;
  };
  imageryProcessedDate: {
    year: number;
    month: number;
    day: number;
  };
  dsmUrl: string;
  rgbUrl: string;
  maskUrl: string;
  annualFluxUrl: string;
  monthlyFluxUrl: string;
  imageryQuality: string;
}

export interface GeoTiff {
  width: number;
  height: number;
  rasters: Array<number>[];
  bounds: Bounds;
}

export interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface PaletteOptions {
  data: GeoTiff;
  mask?: GeoTiff;
  colors?: string[];
  min?: number;
  max?: number;
  index?: number;
}