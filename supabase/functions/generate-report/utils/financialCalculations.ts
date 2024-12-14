export interface FinancialMetrics {
  totalSystemCost: number;
  federalTaxCredit: number;
  netSystemCost: number;
  annualSavings: number;
  paybackPeriod: number;
  monthlyBillSavings: number;
  twentyYearSavings: number;
  inflationAdjustedSavings: number;
}

export function calculateFinancialMetrics(
  systemSize: number,
  annualProduction: number,
  utilityRate: number = 0.15, // Average utility rate per kWh
  annualUtilityInflation: number = 0.03 // 3% annual utility rate increase
): FinancialMetrics {
  // Ensure we have valid numbers
  systemSize = Number(systemSize) || 0;
  annualProduction = Number(annualProduction) || 0;
  
  console.log('Calculating financials for:', { systemSize, annualProduction });

  const systemCostPerWatt = 2.95; // Industry average cost per watt
  const totalSystemCost = systemSize * 1000 * systemCostPerWatt;
  const federalTaxCredit = totalSystemCost * 0.30;
  const netSystemCost = totalSystemCost - federalTaxCredit;

  // Calculate annual savings based on production and utility rate
  const annualSavings = annualProduction * utilityRate;
  const monthlyBillSavings = annualSavings / 12;
  
  // Calculate 20-year projections with utility rate inflation
  let twentyYearSavings = 0;
  let inflationAdjustedSavings = 0;
  let currentRate = utilityRate;

  for (let year = 1; year <= 20; year++) {
    const yearSavings = annualProduction * currentRate;
    twentyYearSavings += yearSavings;
    inflationAdjustedSavings += yearSavings / Math.pow(1.05, year); // 5% discount rate
    currentRate *= (1 + annualUtilityInflation);
  }

  const paybackPeriod = annualSavings > 0 ? netSystemCost / annualSavings : 0;

  const results = {
    totalSystemCost,
    federalTaxCredit,
    netSystemCost,
    annualSavings,
    paybackPeriod,
    monthlyBillSavings,
    twentyYearSavings,
    inflationAdjustedSavings
  };

  console.log('Financial calculation results:', results);
  return results;
}