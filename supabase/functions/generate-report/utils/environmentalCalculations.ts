export interface EnvironmentalImpact {
  carbonOffset: number;
  treesEquivalent: number;
  homesEquivalent: number;
  gasSaved: number;
}

export function calculateEnvironmentalImpact(
  annualProduction: number,
  carbonOffsetRate: number
): EnvironmentalImpact {
  // Convert kWh to MWh for carbon calculations
  const annualProductionMWh = annualProduction / 1000;
  
  // Calculate carbon offset in metric tons
  const carbonOffset = (annualProductionMWh * carbonOffsetRate) / 1000;
  
  // Environmental equivalencies based on EPA calculations
  // Average tree absorbs about 0.039 metric tons CO2 per year
  const treesEquivalent = Math.round(carbonOffset / 0.039);
  
  // Average US home uses about 10,715 kWh per year
  const homesEquivalent = Math.round(annualProduction / 10715);
  
  // Each gallon of gasoline produces about 8.887 kg CO2
  const gasSaved = Math.round(carbonOffset * 1000 / 8.887);

  return {
    carbonOffset,
    treesEquivalent,
    homesEquivalent,
    gasSaved
  };
}