import { LatLng, DataLayersResponse } from './types';

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