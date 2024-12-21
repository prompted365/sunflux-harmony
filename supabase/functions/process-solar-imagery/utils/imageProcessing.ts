import { createCanvas } from "https://deno.land/x/canvas@v1.4.1/mod.ts";
import * as geotiff from 'https://esm.sh/geotiff@2.1.3';

const processAndStoreImagery = async (
  dataLayer: any,
  calculationId: string,
  supabase: any,
  apiKey: string
) => {
  const imageryUrls = {
    rgb: null,
    dsm: null,
    mask: null,
    annualFlux: null,
    monthlyFlux: null
  };

  try {
    console.log('Processing imagery for data layer:', dataLayer);

    const imageProcessingPromises = [
      {
        url: dataLayer.rgb_url,
        type: 'rgb',
        heatmap: false
      },
      {
        url: dataLayer.dsm_url,
        type: 'dsm',
        heatmap: true
      },
      {
        url: dataLayer.mask_url,
        type: 'mask',
        heatmap: false
      },
      {
        url: dataLayer.annual_flux_url,
        type: 'annualFlux',
        heatmap: true
      },
      {
        url: dataLayer.monthly_flux_url,
        type: 'monthlyFlux',
        heatmap: true
      }
    ].map(async ({ url, type, heatmap }) => {
      if (url) {
        try {
          const publicUrl = await processAndStoreImage(
            url,
            apiKey,
            supabase,
            calculationId,
            type,
            heatmap
          );
          if (publicUrl) {
            imageryUrls[type as keyof typeof imageryUrls] = publicUrl;
          }
        } catch (error) {
          console.error(`Error processing ${type} image:`, error);
        }
      }
    });

    await Promise.all(imageProcessingPromises);
    console.log('Processed imagery URLs:', imageryUrls);
  } catch (error) {
    console.error('Error processing imagery:', error);
  }

  return imageryUrls;
};

const processAndStoreImage = async (
  url: string,
  apiKey: string,
  supabase: any,
  calculationId: string,
  imageType: string,
  useHeatmap: boolean = false
): Promise<string | null> => {
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

    console.log(`Processing ${imageType} raster data:`, {
      width: rasters.width,
      height: rasters.height,
      count: rasters.length,
      sampleFormat: image.getSampleFormat(),
      bitsPerSample: image.getBitsPerSample(),
      samplesPerPixel: image.getSamplesPerPixel()
    });

    // Create canvas and render image
    const canvas = createCanvas(rasters.width, rasters.height);
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(rasters.width, rasters.height);

    // Process raster data
    for (let y = 0; y < rasters.height; y++) {
      for (let x = 0; x < rasters.width; x++) {
        const i = y * rasters.width + x;
        const pixelIndex = i * 4;

        if (imageType === 'mask') {
          // For mask images, use single band data for all RGB channels
          const value = rasters[0][i] ? 255 : 0;
          imageData.data[pixelIndex] = value;
          imageData.data[pixelIndex + 1] = value;
          imageData.data[pixelIndex + 2] = value;
          imageData.data[pixelIndex + 3] = 255;
        } else if (useHeatmap) {
          // For heatmap images, apply color gradient
          const value = rasters[0][i];
          const color = getHeatmapColor(value);
          imageData.data[pixelIndex] = color.r;
          imageData.data[pixelIndex + 1] = color.g;
          imageData.data[pixelIndex + 2] = color.b;
          imageData.data[pixelIndex + 3] = 255;
        } else {
          // For RGB images, use all three bands
          imageData.data[pixelIndex] = rasters[0][i];
          imageData.data[pixelIndex + 1] = rasters[1][i];
          imageData.data[pixelIndex + 2] = rasters[2][i];
          imageData.data[pixelIndex + 3] = 255;
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);

    // Convert canvas to PNG buffer
    const pngData = canvas.toBuffer('image/png');

    // Upload to Supabase Storage
    const filePath = `${calculationId}/${imageType}.png`;
    const { error: uploadError } = await supabase.storage
      .from('solar_imagery')
      .upload(filePath, pngData, {
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
};

const getHeatmapColor = (value: number) => {
  // Simple blue to red gradient
  const r = Math.min(255, Math.max(0, Math.floor(value * 255)));
  const b = Math.min(255, Math.max(0, Math.floor((1 - value) * 255)));
  return { r, g: 0, b };
};

export { processAndStoreImagery };