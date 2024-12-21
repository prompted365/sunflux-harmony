import * as geotiff from 'https://esm.sh/geotiff@2.1.3';
import { GeoTiff, RGBColor, PaletteOptions } from './types.ts';

export async function processAndStoreImage(
  url: string, 
  apiKey: string, 
  supabase: any, 
  propertyId: string,
  imageType: string,
  useHeatmap: boolean = false
): Promise<string | null> {
  try {
    console.log(`Processing ${imageType} image from URL:`, url);
    
    const solarUrl = url.includes('solar.googleapis.com') ? url + `&key=${apiKey}` : url;
    const response = await fetch(solarUrl);
    
    if (response.status !== 200) {
      console.error(`Failed to download ${imageType} image:`, await response.json());
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    const tiff = await geotiff.fromArrayBuffer(arrayBuffer);
    const image = await tiff.getImage();
    const rasters = await image.readRasters();

    const canvas = useHeatmap ? 
      renderPalette({
        data: {
          width: rasters.width,
          height: rasters.height,
          rasters: [...Array(rasters.length).keys()].map(i => 
            Array.from(rasters[i] as unknown as Uint8Array)
          ),
          bounds: { north: 0, south: 0, east: 0, west: 0 }
        },
        colors: ['0000FF', '00FF00', 'FFFF00', 'FF0000'],
        min: 0,
        max: Math.max(...Array.from(rasters[0] as unknown as Uint8Array))
      }) :
      renderRGB({
        width: rasters.width,
        height: rasters.height,
        rasters: [...Array(rasters.length).keys()].map(i => 
          Array.from(rasters[i] as unknown as Uint8Array)
        ),
        bounds: { north: 0, south: 0, east: 0, west: 0 }
      });

    const blob = await new Promise<Blob>((resolve) => 
      canvas.toBlob(resolve!, 'image/png')
    );
    const arrayBufferPng = await blob.arrayBuffer();

    const filePath = `${propertyId}/${imageType}.png`;
    const { error: uploadError } = await supabase.storage
      .from('solar_imagery')
      .upload(filePath, new Uint8Array(arrayBufferPng), {
        contentType: 'image/png',
        upsert: true
      });

    if (uploadError) {
      console.error(`Error uploading ${imageType} image:`, uploadError);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('solar_imagery')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error(`Error processing ${imageType} image:`, error);
    return null;
  }
}

function renderRGB(rgb: GeoTiff, mask?: GeoTiff): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = mask ? mask.width : rgb.width;
  canvas.height = mask ? mask.height : rgb.height;

  const dw = rgb.width / canvas.width;
  const dh = rgb.height / canvas.height;

  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(canvas.width, canvas.height);

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const rgbIdx = Math.floor(y * dh) * rgb.width + Math.floor(x * dw);
      const maskIdx = y * canvas.width + x;
      const imgIdx = y * canvas.width * 4 + x * 4;
      
      img.data[imgIdx + 0] = rgb.rasters[0][rgbIdx];
      img.data[imgIdx + 1] = rgb.rasters[1][rgbIdx];
      img.data[imgIdx + 2] = rgb.rasters[2][rgbIdx];
      img.data[imgIdx + 3] = mask ? mask.rasters[0][maskIdx] * 255 : 255;
    }
  }

  ctx.putImageData(img, 0, 0);
  return canvas;
}

function renderPalette({
  data,
  mask,
  colors = ['000000', 'ffffff'],
  min = 0,
  max = 1,
  index = 0,
}: PaletteOptions): HTMLCanvasElement {
  const palette = createPalette(colors);
  const indices = data.rasters[index]
    .map((x) => normalize(x, max, min))
    .map((x) => Math.round(x * (palette.length - 1)));

  return renderRGB({
    ...data,
    rasters: [
      indices.map((i: number) => palette[i].r),
      indices.map((i: number) => palette[i].g),
      indices.map((i: number) => palette[i].b),
    ],
  }, mask);
}

function createPalette(hexColors: string[]): RGBColor[] {
  const rgb = hexColors.map(colorToRGB);
  const size = 256;
  const step = (rgb.length - 1) / (size - 1);
  
  return Array(size)
    .fill(0)
    .map((_, i) => {
      const index = i * step;
      const lower = Math.floor(index);
      const upper = Math.ceil(index);
      return {
        r: lerp(rgb[lower].r, rgb[upper].r, index - lower),
        g: lerp(rgb[lower].g, rgb[upper].g, index - lower),
        b: lerp(rgb[lower].b, rgb[upper].b, index - lower),
      };
    });
}

function colorToRGB(color: string): RGBColor {
  const hex = color.startsWith('#') ? color.slice(1) : color;
  return {
    r: parseInt(hex.substring(0, 2), 16),
    g: parseInt(hex.substring(2, 4), 16),
    b: parseInt(hex.substring(4, 6), 16),
  };
}

function normalize(x: number, max: number = 1, min: number = 0): number {
  const y = (x - min) / (max - min);
  return clamp(y, 0, 1);
}

function lerp(x: number, y: number, t: number): number {
  return x + t * (y - x);
}

function clamp(x: number, min: number, max: number): number {
  return Math.min(Math.max(x, min), max);
}