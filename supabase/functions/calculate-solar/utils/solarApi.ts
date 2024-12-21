import { BuildingInsightsResponse, DataLayersResponse, LatLng } from './types.ts';
import { processAndStoreImage } from './imageProcessing.ts';

export async function getBuildingInsights(property: any, apiKey: string): Promise<BuildingInsightsResponse> {
  const args = {
    'location.latitude': property.latitude.toString(),
    'location.longitude': property.longitude.toString(),
    'requiredQuality': 'HIGH',
  };
  
  console.log('GET buildingInsights\n', args);
  const params = new URLSearchParams({ ...args, key: apiKey });
  
  const response = await fetch(
    `https://solar.googleapis.com/v1/buildingInsights:findClosest?${params}`
  );
  const content = await response.json();
  
  if (response.status !== 200) {
    console.error('getBuildingInsights error:\n', content);
    throw new Error(content.error?.message || 'Failed to get building insights');
  }
  
  console.log('buildingInsights response:', content);
  return content;
}

export async function getDataLayerUrls(
  location: LatLng,
  radiusMeters: number,
  apiKey: string,
): Promise<DataLayersResponse> {
  const args = {
    'location.latitude': location.latitude.toFixed(5),
    'location.longitude': location.longitude.toFixed(5),
    radius_meters: radiusMeters.toString(),
    required_quality: 'HIGH',
  };
  
  console.log('GET dataLayers\n', args);
  const params = new URLSearchParams({ ...args, key: apiKey });
  
  const response = await fetch(`https://solar.googleapis.com/v1/dataLayers:get?${params}`);
  const content = await response.json();
  
  if (response.status !== 200) {
    console.error('getDataLayerUrls error:\n', content);
    throw new Error(content.error?.message || 'Failed to get data layers');
  }
  
  console.log('dataLayersResponse', content);
  return content;
}

export async function processAndStoreImagery(
  property: any, 
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
        latitude: property.latitude, 
        longitude: property.longitude 
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