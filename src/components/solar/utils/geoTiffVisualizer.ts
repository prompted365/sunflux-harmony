import * as GeoTIFF from 'geotiff';

export interface GeoTiffVisualizerOptions {
  min?: number;
  max?: number;
  colormap?: string[];
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
    
    // Get image dimensions using the proper method
    const width = image.getWidth();
    const height = image.getHeight();
    const data = await image.readRasters();

    // Handle TypedArray data properly
    const values = data[0] as Float32Array | Uint8Array | Int16Array;
    const valuesArray = Array.from(values);
    
    // Normalize raster data
    const min = options.min ?? Math.min(...valuesArray);
    const max = options.max ?? Math.max(...valuesArray);
    const normalized = valuesArray.map(value => 
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

export function downloadCanvas(canvas: HTMLCanvasElement, filename: string) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}