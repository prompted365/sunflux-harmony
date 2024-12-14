interface SolarApiResponse {
  solarPotential: {
    maxArrayPanelsCount: number;
    maxArrayAreaMeters2: number;
    maxSunshineHoursPerYear: number;
    carbonOffsetFactorKgPerMwh: number;
    panelCapacityWatts: number;
  };
  financialAnalyses: Array<{
    monthlyBill: { units: string };
    financialDetails?: {
      initialAcKwhPerYear: number;
      federalIncentive: { units: string };
    };
  }>;
}

export async function fetchSolarData(latitude: number, longitude: number): Promise<SolarApiResponse> {
  const apiKey = Deno.env.get('GOOGLE_CLOUD_API_KEY');
  if (!apiKey) {
    throw new Error('Google Cloud API key not configured');
  }

  // Get building insights
  const buildingInsightsResponse = await fetch(
    `https://solar.googleapis.com/v1/buildingInsights:findClosest?` +
    new URLSearchParams({
      'location.latitude': latitude.toString(),
      'location.longitude': longitude.toString(),
      key: apiKey,
    })
  );

  const buildingData = await buildingInsightsResponse.json();
  
  if (!buildingInsightsResponse.ok) {
    console.error('Building insights error:', buildingData);
    throw new Error('Failed to fetch building insights: ' + JSON.stringify(buildingData));
  }

  // Get data layers for visualization
  const dataLayersResponse = await fetch(
    `https://solar.googleapis.com/v1/dataLayers:get?` +
    new URLSearchParams({
      'location.latitude': latitude.toString(),
      'location.longitude': longitude.toString(),
      'radius_meters': '100',
      'required_quality': 'LOW',
      key: apiKey,
    })
  );

  const layersData = await dataLayersResponse.json();

  if (!dataLayersResponse.ok) {
    console.error('Data layers error:', layersData);
    throw new Error('Failed to fetch data layers: ' + JSON.stringify(layersData));
  }

  return buildingData;
}

export function processSolarData(data: SolarApiResponse) {
  const solarPotential = data.solarPotential;
  const financialData = data.financialAnalyses?.[3] || null; // Using the $35 monthly bill scenario

  return {
    status: 'completed',
    system_size: (solarPotential.maxArrayPanelsCount * solarPotential.panelCapacityWatts) / 1000,
    irradiance_data: {
      maxSunshineHours: solarPotential.maxSunshineHoursPerYear,
      carbonOffset: solarPotential.carbonOffsetFactorKgPerMwh,
    },
    panel_layout: {
      maxPanels: solarPotential.maxArrayPanelsCount,
      maxArea: solarPotential.maxArrayAreaMeters2,
      panelDimensions: {
        height: solarPotential.panelHeightMeters,
        width: solarPotential.panelWidthMeters,
      }
    },
    estimated_production: {
      yearlyEnergyDcKwh: financialData?.financialDetails?.initialAcKwhPerYear || null,
      monthlyBill: financialData?.monthlyBill?.units || null,
      financialDetails: financialData?.financialDetails || null,
    }
  };
}