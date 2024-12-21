export async function fetchSolarData(latitude: number, longitude: number): Promise<SolarApiResponse> {
  const apiKey = Deno.env.get('GOOGLE_CLOUD_API_KEY');
  if (!apiKey) {
    throw new Error('Google Cloud API key not configured');
  }

  console.log('Fetching solar data for coordinates:', { latitude, longitude });

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

  console.log('Received solar data:', buildingData);

  return buildingData;
}

export async function getDataLayerUrls(
  location: { latitude: number; longitude: number },
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
    console.error('getDataLayerUrls\n', content);
    throw content;
  }
  
  console.log('dataLayersResponse', content);
  return content;
}

export interface DataLayersResponse {
  imageryDate: {
    year: number;
    month: number;
    day: number;
  };
  imageryProcessedDate: {
    year: number;
    month: number;
    day: number;
  };
  dsmUrl: string;
  rgbUrl: string;
  maskUrl: string;
  annualFluxUrl: string;
  monthlyFluxUrl: string;
  imageryQuality: string;
}

export function processSolarData(data: SolarApiResponse) {
  const solarPotential = data.solarPotential;
  
  // Find the most relevant financial analysis (using $35 monthly bill scenario as default)
  const financialData = data.financialAnalyses?.find(analysis => 
    analysis.monthlyBill?.units === "35"
  ) || data.financialAnalyses?.[3] || null;

  // Find the optimal panel configuration
  const optimalConfig = solarPotential.solarPanelConfigs?.reduce((best, current) => {
    return (current.yearlyEnergyDcKwh > (best?.yearlyEnergyDcKwh || 0)) ? current : best;
  }, null);

  return {
    status: 'completed',
    system_size: (solarPotential.maxArrayPanelsCount * solarPotential.panelCapacityWatts) / 1000,
    irradiance_data: {
      maxSunshineHours: solarPotential.maxSunshineHoursPerYear,
      carbonOffset: solarPotential.carbonOffsetFactorKgPerMwh,
      annualSunlight: solarPotential.wholeRoofStats.sunshineQuantiles[5], // median value
    },
    panel_layout: {
      maxPanels: solarPotential.maxArrayPanelsCount,
      maxArea: solarPotential.maxArrayAreaMeters2,
      panelDimensions: {
        height: solarPotential.panelHeightMeters,
        width: solarPotential.panelWidthMeters,
      },
      optimalConfiguration: optimalConfig ? {
        panelCount: optimalConfig.panelsCount,
        yearlyEnergy: optimalConfig.yearlyEnergyDcKwh,
        segments: optimalConfig.roofSegmentSummaries,
      } : null,
    },
    estimated_production: {
      yearlyEnergyDcKwh: optimalConfig?.yearlyEnergyDcKwh || null,
      monthlyBill: financialData?.monthlyBill?.units || null,
      financialDetails: {
        initialCost: financialData?.cashPurchaseSavings?.outOfPocketCost || null,
        federalIncentive: financialData?.cashPurchaseSavings?.rebateValue || null,
        monthlyBillSavings: financialData?.monthlyBill?.units || null,
        paybackYears: financialData?.cashPurchaseSavings?.paybackYears || null,
        lifetimeSavings: financialData?.cashPurchaseSavings?.savings?.savingsLifetime || null,
        firstYearSavings: financialData?.cashPurchaseSavings?.savings?.savingsYear1 || null,
      },
      environmentalImpact: {
        carbonOffset: (optimalConfig?.yearlyEnergyDcKwh || 0) * (solarPotential.carbonOffsetFactorKgPerMwh / 1000),
        treesEquivalent: Math.round(((optimalConfig?.yearlyEnergyDcKwh || 0) * (solarPotential.carbonOffsetFactorKgPerMwh / 1000)) * 45), // EPA estimate: 1 tree absorbs ~22kg CO2 per year
        homesEquivalent: Math.round((optimalConfig?.yearlyEnergyDcKwh || 0) / 10700), // Average US home uses 10,700 kWh per year
      }
    }
  };
}

interface SolarApiResponse {
  name: string;
  center: {
    latitude: number;
    longitude: number;
  };
  solarPotential: {
    maxArrayPanelsCount: number;
    maxArrayAreaMeters2: number;
    maxSunshineHoursPerYear: number;
    carbonOffsetFactorKgPerMwh: number;
    wholeRoofStats: {
      areaMeters2: number;
      sunshineQuantiles: number[];
      groundAreaMeters2: number;
    };
    panelCapacityWatts: number;
    panelHeightMeters: number;
    panelWidthMeters: number;
    panelLifetimeYears: number;
    solarPanelConfigs: Array<{
      panelsCount: number;
      yearlyEnergyDcKwh: number;
      roofSegmentSummaries: Array<{
        pitchDegrees: number;
        azimuthDegrees: number;
        panelsCount: number;
        yearlyEnergyDcKwh: number;
        segmentIndex: number;
      }>;
    }>;
  };
  financialAnalyses: Array<{
    monthlyBill: {
      currencyCode: string;
      units: string;
    };
    financialDetails?: {
      initialAcKwhPerYear: number;
      federalIncentive: {
        currencyCode: string;
        units: string;
      };
    };
    cashPurchaseSavings?: {
      outOfPocketCost: {
        currencyCode: string;
        units: string;
      };
      rebateValue: {
        currencyCode: string;
        units: string;
      };
      paybackYears: number;
      savings: {
        savingsYear1: {
          currencyCode: string;
          units: string;
        };
        savingsLifetime: {
          currencyCode: string;
          units: string;
        };
      };
    };
  }>;
}
