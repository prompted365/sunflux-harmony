import { GeoTiff, PaletteOptions } from './types';
import { createPalette, normalize } from './colorUtils';

export function renderRGB(rgb: GeoTiff, mask?: GeoTiff): HTMLCanvasElement {
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

export function renderPalette({
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