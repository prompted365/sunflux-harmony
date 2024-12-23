export interface GeoTiff {
  width: number;
  height: number;
  rasters: Array<number>[];
  bounds?: {
    left: number;
    bottom: number;
    right: number;
    top: number;
  };
}

export interface RenderOptions {
  min?: number;
  max?: number;
  opacity?: number;
  colormap?: string[];
}