import { GeoTiff } from '../types';
import { createPalette, normalize } from '../colorUtils';

interface RenderOptions {
  min?: number;
  max?: number;
  opacity?: number;
  colormap?: string[];
}

export class LayerRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(width: number, height: number) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d')!;
  }

  renderRGB(rgb: GeoTiff, options: RenderOptions = {}): HTMLCanvasElement {
    const { opacity = 1 } = options;
    const imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);

    for (let y = 0; y < this.canvas.height; y++) {
      for (let x = 0; x < this.canvas.width; x++) {
        const i = (y * this.canvas.width + x) * 4;
        const rgbIdx = y * rgb.width + x;

        imageData.data[i] = rgb.rasters[0][rgbIdx];
        imageData.data[i + 1] = rgb.rasters[1][rgbIdx];
        imageData.data[i + 2] = rgb.rasters[2][rgbIdx];
        imageData.data[i + 3] = 255 * opacity;
      }
    }

    this.ctx.putImageData(imageData, 0, 0);
    return this.canvas;
  }

  renderPalette(data: GeoTiff, options: RenderOptions = {}): HTMLCanvasElement {
    const { min = 0, max = 1, opacity = 1, colormap = ['000000', 'FFFFFF'] } = options;
    const palette = createPalette(colormap);
    
    const indices = data.rasters[0]
      .map(x => normalize(x, max, min))
      .map(x => Math.round(x * (palette.length - 1)));

    const imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);

    for (let i = 0; i < indices.length; i++) {
      const idx = i * 4;
      const color = palette[indices[i]];
      
      imageData.data[idx] = color.r;
      imageData.data[idx + 1] = color.g;
      imageData.data[idx + 2] = color.b;
      imageData.data[idx + 3] = 255 * opacity;
    }

    this.ctx.putImageData(imageData, 0, 0);
    return this.canvas;
  }

  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }
}