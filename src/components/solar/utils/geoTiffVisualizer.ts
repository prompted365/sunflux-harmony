import * as GeoTIFF from 'geotiff';

export interface GeoTiffVisualizerOptions {
  min?: number;
  max?: number;
  colormap?: string[];
  band?: number;
}

export interface RGBOptions {
  redBand?: number;
  greenBand?: number;
  blueBand?: number;
}

export async function visualizeGeoTIFF(
  url: string,
  options: GeoTiffVisualizerOptions = {}
): Promise<HTMLCanvasElement> {
  try {
    // Fetch the GeoTIFF data
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch GeoTIFF data');
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
    const image = await tiff.getImage();
    
    // Get image dimensions
    const width = image.getWidth();
    const height = image.getHeight();
    const data = await image.readRasters();

    // Handle single band visualization
    const bandIndex = options.band || 0;
    const values = Array.from(data[bandIndex] as Float32Array | Uint8Array | Int16Array);
    
    // Normalize raster data
    const min = options.min ?? Math.min(...values);
    const max = options.max ?? Math.max(...values);
    const normalized = values.map(value => 
      value === -9999 ? 0 : (value - min) / (max - min) * 255
    );

    // Create and setup canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.createImageData(width, height);

    // Render data on canvas
    for (let i = 0; i < normalized.length; i++) {
      const color = normalized[i];
      imageData.data[i * 4] = color; // Red
      imageData.data[i * 4 + 1] = color; // Green
      imageData.data[i * 4 + 2] = color; // Blue
      imageData.data[i * 4 + 3] = 255; // Alpha
    }
    
    ctx.putImageData(imageData, 0, 0);
    return canvas;
  } catch (error) {
    console.error('Error visualizing GeoTIFF:', error);
    throw error;
  }
}

export async function visualizeRGB(
  url: string,
  options: RGBOptions = {}
): Promise<HTMLCanvasElement> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch GeoTIFF data');
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
    const image = await tiff.getImage();
    
    const width = image.getWidth();
    const height = image.getHeight();
    const data = await image.readRasters();

    // Default to first three bands if not specified
    const redBand = options.redBand || 0;
    const greenBand = options.greenBand || 1;
    const blueBand = options.blueBand || 2;

    // Convert to arrays and normalize
    const redValues = Array.from(data[redBand] as Float32Array | Uint8Array | Int16Array);
    const greenValues = Array.from(data[greenBand] as Float32Array | Uint8Array | Int16Array);
    const blueValues = Array.from(data[blueBand] as Float32Array | Uint8Array | Int16Array);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.createImageData(width, height);

    for (let i = 0; i < redValues.length; i++) {
      imageData.data[i * 4] = normalize(redValues[i]) * 255;
      imageData.data[i * 4 + 1] = normalize(greenValues[i]) * 255;
      imageData.data[i * 4 + 2] = normalize(blueValues[i]) * 255;
      imageData.data[i * 4 + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
  } catch (error) {
    console.error('Error visualizing RGB GeoTIFF:', error);
    throw error;
  }
}

export function normalize(value: number, max: number = 1, min: number = 0): number {
  if (value === -9999) return 0;
  return clamp((value - min) / (max - min), 0, 1);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function downloadCanvas(canvas: HTMLCanvasElement, filename: string) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}