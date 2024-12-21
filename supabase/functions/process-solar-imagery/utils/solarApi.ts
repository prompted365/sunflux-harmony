interface Location {
  latitude: number;
  longitude: number;
}

interface DataLayers {
  imageryDate?: {
    year: number;
    month: number;
    day: number;
  };
  imageryProcessedDate?: {
    year: number;
    month: number;
    day: number;
  };
  dsmUrl?: string;
  rgbUrl?: string;
  maskUrl?: string;
  annualFluxUrl?: string;
  monthlyFluxUrl?: string;
  hourlyShadeUrls?: string[];
  imageryQuality?: string;
}

export async function storeDataLayers(
  location: Location,
  calculationId: string,
  supabase: any,
  apiKey: string
): Promise<DataLayers | null> {
  try {
    // Fetch data layers from Google Solar API
    const dataLayersUrl = `https://solar.googleapis.com/v1/dataLayers:get?location.latitude=${location.latitude}&location.longitude=${location.longitude}&radiusMeters=100&view=FULL_LAYERS&key=${apiKey}`;
    
    console.log('Fetching data layers from:', dataLayersUrl);
    
    const dataLayersResponse = await fetch(dataLayersUrl);
    if (!dataLayersResponse.ok) {
      const errorText = await dataLayersResponse.text();
      console.error('Failed to fetch data layers:', errorText);
      throw new Error(`Failed to fetch data layers: ${errorText}`);
    }

    const dataLayers = await dataLayersResponse.json();
    console.log('Successfully fetched data layers');

    return {
      imageryDate: dataLayers.imageryDate,
      imageryProcessedDate: dataLayers.imageryProcessedDate,
      dsmUrl: dataLayers.dsmUrl,
      rgbUrl: dataLayers.rgbUrl,
      maskUrl: dataLayers.maskUrl,
      annualFluxUrl: dataLayers.annualFluxUrl,
      monthlyFluxUrl: dataLayers.monthlyFluxUrl,
      hourlyShadeUrls: dataLayers.hourlyShadeUrls,
      imageryQuality: dataLayers.imageryQuality
    };
  } catch (error) {
    console.error('Error fetching data layers:', error);
    return null;
  }
}