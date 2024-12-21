import { BuildingInsightsResponse } from './types.ts';

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