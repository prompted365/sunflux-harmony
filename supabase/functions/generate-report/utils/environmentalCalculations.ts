interface EnvironmentalImpact {
  carbonOffset: number;
  treesEquivalent: number;
  homesEquivalent: number;
  gasSaved: number;
}

export function calculateEnvironmentalImpact(
  solarData: any,
  annualProduction: number
): EnvironmentalImpact {
  const carbonOffsetRate = solarData.solarPotential.carbonOffsetFactorKgPerMwh || 0;
  
  // Convert kWh to MWh and calculate carbon offset
  const carbonOffset = (annualProduction / 1000) * (carbonOffsetRate / 1000);
  
  // Environmental equivalencies
  const treesEquivalent = Math.round(carbonOffset * 45); // EPA estimate: 1 metric ton CO2 = ~45 trees
  const homesEquivalent = Math.round(annualProduction / 10700); // Average US home uses 10,700 kWh/year
  const gasSaved = Math.round(carbonOffset * 113); // EPA estimate: 1 metric ton CO2 = 113 gallons of gas

  return {
    carbonOffset,
    treesEquivalent,
    homesEquivalent,
    gasSaved
  };
}