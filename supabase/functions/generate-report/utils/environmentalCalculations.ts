interface EnvironmentalImpact {
  carbonOffset: number;
  treesEquivalent: number;
  homesEquivalent: number;
  gasSaved: number;
}

export function calculateEnvironmentalImpact(
  annualProduction: number,
  carbonOffsetRate: number
): EnvironmentalImpact {
  const carbonOffset = (carbonOffsetRate * annualProduction) / 1000;
  const treesEquivalent = carbonOffset * 46.3; // EPA: 1 metric ton CO2 = 46.3 trees
  const homesEquivalent = annualProduction / 10632; // Average home uses 10,632 kWh annually
  const gasSaved = (carbonOffset * 113.7); // EPA: 1 metric ton CO2 = 113.7 gallons of gasoline

  return {
    carbonOffset,
    treesEquivalent: Math.round(treesEquivalent),
    homesEquivalent: Number(homesEquivalent.toFixed(1)),
    gasSaved: Math.round(gasSaved)
  };
}