import { LatLng, DataLayersResponse } from './types';
import { processAndStoreImage } from './imageProcessing';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export async function getDataLayerUrls(
  location: LatLng,
  radiusMeters: number,
  apiKey: string,
): Promise<DataLayersResponse> {
  const args = {
    'location.latitude': location.latitude.toFixed(5),
    'location.longitude': location.longitude.toFixed(5),
    radius_meters: radiusMeters.toString(),
    required_quality: 'LOW',
  };
  
  console.log('GET dataLayers\n', args);
  const params = new URLSearchParams({ ...args, key: apiKey });
  
  const response = await fetch(`https://solar.googleapis.com/v1/dataLayers:get?${params}`);
  const content = await response.json();
  
  if (response.status !== 200) {
    console.error('getDataLayerUrls error:\n', content);
    throw content;
  }
  
  console.log('dataLayersResponse', content);
  return content;
}

export async function processAndStoreImagery(
  solarData: any, 
  propertyId: string, 
  supabase: any, 
  apiKey: string
) {
  const imageryUrls = {
    rgb: null,
    dsm: null,
    mask: null,
    annualFlux: null,
    monthlyFlux: null
  };

  try {
    const dataLayers = await getDataLayerUrls(
      { 
        latitude: solarData.center.latitude, 
        longitude: solarData.center.longitude 
      },
      100,
      apiKey
    );

    console.log('Retrieved data layers:', dataLayers);

    const imageProcessingPromises = [
      {
        url: dataLayers.rgbUrl,
        type: 'rgb',
        heatmap: false
      },
      {
        url: dataLayers.dsmUrl,
        type: 'dsm',
        heatmap: true
      },
      {
        url: dataLayers.maskUrl,
        type: 'mask',
        heatmap: false
      },
      {
        url: dataLayers.annualFluxUrl,
        type: 'annualFlux',
        heatmap: true
      },
      {
        url: dataLayers.monthlyFluxUrl,
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
            propertyId,
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
}