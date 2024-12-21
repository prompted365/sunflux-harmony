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