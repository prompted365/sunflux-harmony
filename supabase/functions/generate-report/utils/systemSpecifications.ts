interface SystemSpecs {
  systemSize: number;
  annualProduction: number;
  panelCount: number;
  arrayArea: number;
  sunshineHours: number;
  efficiency: number;
}

export function calculateSystemSpecs(solarData: any): SystemSpecs {
  const solarPotential = solarData?.solarPotential || {};
  
  // Find optimal panel configuration with null checks
  const optimalConfig = solarPotential.solarPanelConfigs?.reduce((best: any, current: any) => {
    return (current?.yearlyEnergyDcKwh > (best?.yearlyEnergyDcKwh || 0)) ? current : best;
  }, null);

  const systemSize = ((solarPotential.maxArrayPanelsCount || 0) * (solarPotential.panelCapacityWatts || 0)) / 1000;
  const annualProduction = optimalConfig?.yearlyEnergyDcKwh || 0;
  const panelCount = solarPotential.maxArrayPanelsCount || 0;
  const arrayArea = solarPotential.maxArrayAreaMeters2 || 0;
  const sunshineHours = solarPotential.maxSunshineHoursPerYear || 0;
  
  // Calculate system efficiency with null check
  const efficiency = systemSize > 0 ? (annualProduction / (systemSize * 1000)) * 100 : 0;

  return {
    systemSize,
    annualProduction,
    panelCount,
    arrayArea,
    sunshineHours,
    efficiency
  };
}