import * as geotiff from 'https://esm.sh/geotiff@2.1.3';
import * as geokeysToProj4 from 'https://esm.sh/geotiff-geokeys-to-proj4@2024.4.13';
import proj4 from 'https://esm.sh/proj4@2.15.0';

interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

interface GeoTiff {
  width: number;
  height: number;
  rasters: Array<number>[];
  bounds: Bounds;
}

export async function downloadAndProcessImage(url: string, apiKey: string): Promise<string> {
  try {
    const solarUrl = url.includes('solar.googleapis.com') ? url + `&key=${apiKey}` : url;
    const response = await fetch(solarUrl);
    
    if (response.status !== 200) {
      console.error('Failed to download image:', await response.json());
      return '';
    }

    const arrayBuffer = await response.arrayBuffer();
    const tiff = await geotiff.fromArrayBuffer(arrayBuffer);
    const image = await tiff.getImage();
    const rasters = await image.readRasters();

    // Convert to base64 for PDF embedding
    const canvas = renderRGB({
      width: rasters.width,
      height: rasters.height,
      rasters: [...Array(rasters.length).keys()].map((i) =>
        Array.from(rasters[i] as unknown as Uint8Array)
      ),
      bounds: { north: 0, south: 0, east: 0, west: 0 } // We don't need bounds for rendering
    });

    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error processing solar image:', error);
    return '';
  }
}

function renderRGB(rgb: GeoTiff): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = rgb.width;
  canvas.height = rgb.height;

  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(canvas.width, canvas.height);

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const rgbIdx = y * rgb.width + x;
      const imgIdx = y * canvas.width * 4 + x * 4;
      
      img.data[imgIdx + 0] = rgb.rasters[0][rgbIdx]; // Red
      img.data[imgIdx + 1] = rgb.rasters[1][rgbIdx]; // Green
      img.data[imgIdx + 2] = rgb.rasters[2][rgbIdx]; // Blue
      img.data[imgIdx + 3] = 255; // Alpha
    }
  }

  ctx.putImageData(img, 0, 0);
  return canvas;
}