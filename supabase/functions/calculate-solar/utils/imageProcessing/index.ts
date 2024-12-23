import { decodeGeoTiff } from './geoTiffDecoder.ts';
import { resizeImage, calculateDimensions } from './resizeUtils.ts';
import { uploadToStorage, checkFileExists } from './storageUtils.ts';
import { GeoTiff, RGBColor, PaletteOptions } from '../types.ts';

const MAX_IMAGE_DIMENSION = 2048; // Maximum dimension for resized images

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
    const decodedData = await decodeGeoTiff(arrayBuffer);

    // Calculate new dimensions if needed
    const { width: targetWidth, height: targetHeight } = calculateDimensions(
      decodedData.width,
      decodedData.height,
      MAX_IMAGE_DIMENSION
    );

    // Generate unique filename
    const uniqueId = url.split('id=').pop()?.split('&')[0];
    if (!uniqueId) {
      throw new Error('Could not extract unique ID from image URL');
    }
    const filename = `${propertyId}/${imageType}.png`;

    // Check if file already exists
    const fileExists = await checkFileExists(supabase, 'solar_imagery', filename);
    if (fileExists) {
      console.log(`File ${filename} already exists in storage`);
      const { data: { signedUrl } } = await supabase.storage
        .from('solar_imagery')
        .createSignedUrl(filename, 3600);
      return signedUrl;
    }

    // Process and resize image data
    const processedData = useHeatmap ? 
      renderPalette({
        data: decodedData,
        colors: ['0000FF', '00FF00', 'FFFF00', 'FF0000'],
        min: 0,
        max: Math.max(...decodedData.rasters[0])
      }) :
      renderRGB(decodedData);

    const resizedData = resizeImage(
      decodedData.width,
      decodedData.height,
      targetWidth,
      targetHeight,
      processedData
    );

    // Upload to storage
    return await uploadToStorage(
      supabase,
      'solar_imagery',
      filename,
      resizedData
    );

  } catch (error) {
    console.error(`Error processing ${imageType} image:`, error);
    return null;
  }
}

export { renderRGB, renderPalette };
