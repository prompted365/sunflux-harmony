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
  // Ensure we have valid numbers
  annualProduction = Number(annualProduction) || 0;
  carbonOffsetRate = Number(carbonOffsetRate) || 0;

  console.log('Calculating environmental impact for:', { annualProduction, carbonOffsetRate });

  // Convert kWh to metric tons of CO2
  const carbonOffset = (annualProduction * carbonOffsetRate) / 1000; // Convert from kg to metric tons

  // EPA equivalency calculations
  // Source: https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator
  const treesEquivalent = carbonOffset * 16.5; // Each metric ton of CO2 = 16.5 trees grown for 10 years
  const homesEquivalent = Math.round(annualProduction / 10632); // Average home uses 10,632 kWh/year
  const gasSaved = carbonOffset * 113; // Each metric ton of CO2 = 113 gallons of gasoline

  const results = {
    carbonOffset,
    treesEquivalent,
    homesEquivalent,
    gasSaved
  };

  console.log('Environmental calculation results:', results);
  return results;
}