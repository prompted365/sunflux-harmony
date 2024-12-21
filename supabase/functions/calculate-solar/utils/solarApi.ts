import { BuildingInsightsResponse, DataLayersResponse, LatLng } from './types.ts';

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

export async function storeDataLayers(
  property: any,
  calculationId: string,
  supabase: any,
  apiKey: string
) {
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

    // Store raw data layers response in database
    const { error: insertError } = await supabase
      .from('data_layers')
      .insert({
        calculation_id: calculationId,
        imagery_date: dataLayers.imageryDate,
        imagery_processed_date: dataLayers.imageryProcessedDate,
        dsm_url: dataLayers.dsmUrl,
        rgb_url: dataLayers.rgbUrl,
        mask_url: dataLayers.maskUrl,
        annual_flux_url: dataLayers.annualFluxUrl,
        monthly_flux_url: dataLayers.monthlyFluxUrl,
        hourly_shade_urls: dataLayers.hourlyShadeUrls,
        imagery_quality: dataLayers.imageryQuality,
        raw_response: dataLayers
      });

    if (insertError) {
      throw insertError;
    }

    // Trigger image processing in a separate function
    await supabase.functions.invoke('process-solar-imagery', {
      body: { 
        calculationId,
        propertyId: property.id
      }
    });

    return dataLayers;
  } catch (error) {
    console.error('Error storing data layers:', error);
    throw error;
  }
}