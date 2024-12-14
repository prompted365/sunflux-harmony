interface FinancialMetrics {
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
  systemSize: number | null,
  annualProduction: number,
  utilityRate: number = 0.15,
  annualUtilityInflation: number = 0.03
): FinancialMetrics {
  // System costs
  const systemCostPerWatt = 2.95;
  const totalSystemCost = (systemSize || 0) * 1000 * systemCostPerWatt;
  const federalTaxCredit = totalSystemCost * 0.30;
  const netSystemCost = totalSystemCost - federalTaxCredit;

  // First year calculations
  const annualSavings = annualProduction * utilityRate;
  const monthlyBillSavings = annualSavings / 12;
  
  // 20-year projections with utility rate inflation
  let twentyYearSavings = 0;
  let inflationAdjustedSavings = 0;
  let currentRate = utilityRate;
  
  for (let year = 1; year <= 20; year++) {
    const yearSavings = annualProduction * currentRate;
    twentyYearSavings += yearSavings;
    // Adjust for present value using 5% discount rate
    inflationAdjustedSavings += yearSavings / Math.pow(1.05, year);
    currentRate *= (1 + annualUtilityInflation);
  }

  const paybackPeriod = annualSavings > 0 ? netSystemCost / annualSavings : 0;

  return {
    totalSystemCost,
    federalTaxCredit,
    netSystemCost,
    annualSavings,
    paybackPeriod,
    monthlyBillSavings,
    twentyYearSavings,
    inflationAdjustedSavings
  };
}