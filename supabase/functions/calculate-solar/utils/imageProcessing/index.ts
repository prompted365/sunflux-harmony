import * as geotiff from 'https://esm.sh/geotiff@2.1.3';
import * as geokeysToProj4 from 'https://esm.sh/geotiff-geokeys-to-proj4@2024.4.13';
import proj4 from 'https://esm.sh/proj4@2.15.0';
import { GeoTiff } from './types.ts';
import { renderRGB, renderPalette } from './renderUtils.ts';

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

    // Create canvas and render image
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

    // Convert canvas to blob
    const blob = await new Promise<Blob>((resolve) => 
      canvas.toBlob(resolve!, 'image/png')
    );
    const arrayBufferPng = await blob.arrayBuffer();

    // Upload to Supabase Storage
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

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('solar_imagery')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error(`Error processing ${imageType} image:`, error);
    return null;
  }
}

export { renderRGB, renderPalette };