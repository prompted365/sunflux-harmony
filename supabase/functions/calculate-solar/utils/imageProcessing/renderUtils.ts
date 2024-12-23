import { createCanvas } from 'https://deno.land/x/canvas@v1.4.1/mod.ts';
import { GeoTiff, PaletteOptions } from './types.ts';
import { createPalette, normalize } from './colorUtils.ts';

export function renderRGB(rgb: GeoTiff, mask?: GeoTiff): any {
  if (!rgb.rasters || rgb.rasters.length < 3) {
    console.error('Invalid RGB data: requires at least 3 raster bands');
    throw new Error('Invalid RGB data');
  }

  const canvas = createCanvas(mask ? mask.width : rgb.width, mask ? mask.height : rgb.height);
  const ctx = canvas.getContext('2d');

  const dw = rgb.width / canvas.width;
  const dh = rgb.height / canvas.height;

  const imageData = ctx.createImageData(canvas.width, canvas.height);

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const rgbIdx = Math.floor(y * dh) * rgb.width + Math.floor(x * dw);
      const maskIdx = y * canvas.width + x;
      const imgIdx = y * canvas.width * 4 + x * 4;
      
      // Ensure raster data exists and is within bounds
      if (rgb.rasters[0] && rgb.rasters[1] && rgb.rasters[2]) {
        imageData.data[imgIdx + 0] = rgb.rasters[0][rgbIdx] || 0;
        imageData.data[imgIdx + 1] = rgb.rasters[1][rgbIdx] || 0;
        imageData.data[imgIdx + 2] = rgb.rasters[2][rgbIdx] || 0;
        imageData.data[imgIdx + 3] = mask && mask.rasters[0] ? 
          mask.rasters[0][maskIdx] * 255 : 255;
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

export function renderPalette({
  data,
  mask,
  colors = ['000000', 'ffffff'],
  min = 0,
  max = 1,
  index = 0,
}: PaletteOptions): any {
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