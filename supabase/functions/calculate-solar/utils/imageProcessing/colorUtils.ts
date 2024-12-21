import { RGBColor } from './types';

export function createPalette(hexColors: string[]): RGBColor[] {
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

export function colorToRGB(color: string): RGBColor {
  const hex = color.startsWith('#') ? color.slice(1) : color;
  return {
    r: parseInt(hex.substring(0, 2), 16),
    g: parseInt(hex.substring(2, 4), 16),
    b: parseInt(hex.substring(4, 6), 16),
  };
}

export function normalize(x: number, max: number = 1, min: number = 0): number {
  const y = (x - min) / (max - min);
  return clamp(y, 0, 1);
}

export function lerp(x: number, y: number, t: number): number {
  return x + t * (y - x);
}

export function clamp(x: number, min: number, max: number): number {
  return Math.min(Math.max(x, min), max);
}