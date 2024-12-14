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
  systemSize: number | null,
  financialDetails: any,
  utilityRate: number = 0.15, // Average utility rate per kWh
  annualUtilityInflation: number = 0.03 // 3% annual utility rate increase
): FinancialMetrics {
  const systemCostPerWatt = 2.95; // Industry average cost per watt
  const totalSystemCost = (systemSize || 0) * 1000 * systemCostPerWatt;
  const federalTaxCredit = totalSystemCost * 0.30;
  const netSystemCost = totalSystemCost - federalTaxCredit;

  // Use actual financial data if available
  const annualSavings = financialDetails?.initialAcKwhPerYear * utilityRate || 0;
  const monthlyBillSavings = financialDetails?.monthlyBill?.units || annualSavings / 12;
  
  // Calculate 20-year projections with utility rate inflation
  let twentyYearSavings = 0;
  let inflationAdjustedSavings = 0;
  let currentRate = utilityRate;
  const annualProduction = financialDetails?.initialAcKwhPerYear || 0;

  for (let year = 1; year <= 20; year++) {
    const yearSavings = annualProduction * currentRate;
    twentyYearSavings += yearSavings;
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