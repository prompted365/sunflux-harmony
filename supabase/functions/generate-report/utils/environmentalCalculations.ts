interface EnvironmentalImpact {
  carbonOffset: number;
  treesEquivalent: number;
  homesEquivalent: number;
  gasSaved: number;
}

export function calculateEnvironmentalImpact(calculation: any): EnvironmentalImpact {
  console.log('Calculating environmental impact from:', JSON.stringify(calculation, null, 2));
  
  const solarPotential = calculation?.solarPotential || {};
  const panelConfig = solarPotential.solarPanelConfigs?.[0] || {};
  
  // Calculate annual energy production in MWh
  const annualEnergyMwh = (panelConfig.yearlyEnergyDcKwh || 0) / 1000;
  
  // Calculate carbon offset using the carbon offset factor
  const carbonOffset = (annualEnergyMwh * (solarPotential.carbonOffsetFactorKgPerMwh || 0)) / 1000;
  
  // Calculate equivalent trees (EPA estimate: 1 tree absorbs ~22kg CO2 per year)
  const treesEquivalent = Math.round(carbonOffset * 1000 / 22);
  
  // Calculate equivalent homes (Average US home uses 10,700 kWh per year)
  const homesEquivalent = Math.round((panelConfig.yearlyEnergyDcKwh || 0) / 10700);
  
  // Calculate equivalent gallons of gas saved (EPA: 8.887 kg CO2 per gallon)
  const gasSaved = Math.round((carbonOffset * 1000) / 8.887);

  const impact = {
    carbonOffset,
    treesEquivalent,
    homesEquivalent,
    gasSaved
  };

  console.log('Calculated environmental impact:', impact);
  return impact;
}