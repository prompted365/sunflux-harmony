interface SystemSpecs {
  systemSize: number;
  annualProduction: number;
  panelCount: number;
  arrayArea: number;
  sunshineHours: number;
  efficiency: number;
}

export function calculateSystemSpecs(calculation: any): SystemSpecs {
  console.log('Calculating system specs from:', JSON.stringify(calculation, null, 2));
  
  const solarPotential = calculation?.solarPotential || {};
  const panelConfig = solarPotential.solarPanelConfigs?.[0] || {};
  
  // Calculate system size (kW)
  const systemSize = ((solarPotential.maxArrayPanelsCount || 0) * (solarPotential.panelCapacityWatts || 0)) / 1000;
  
  // Get annual production from the optimal panel configuration
  const annualProduction = panelConfig.yearlyEnergyDcKwh || 0;
  
  // Get panel count
  const panelCount = solarPotential.maxArrayPanelsCount || 0;
  
  // Get array area
  const arrayArea = solarPotential.maxArrayAreaMeters2 || 0;
  
  // Get sunshine hours
  const sunshineHours = solarPotential.maxSunshineHoursPerYear || 0;
  
  // Calculate system efficiency
  const efficiency = systemSize > 0 ? (annualProduction / (systemSize * 1000)) * 100 : 0;

  const specs = {
    systemSize,
    annualProduction,
    panelCount,
    arrayArea,
    sunshineHours,
    efficiency
  };

  console.log('Calculated system specs:', specs);
  return specs;
}