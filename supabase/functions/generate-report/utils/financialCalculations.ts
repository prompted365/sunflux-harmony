interface FinancialMetrics {
  totalSystemCost: number;
  federalTaxCredit: number;
  netSystemCost: number;
  monthlyBillSavings: number;
  annualSavings: number;
  paybackPeriod: number;
  twentyYearSavings: number;
  inflationAdjustedSavings: number;
}

export function calculateFinancialMetrics(calculation: any): FinancialMetrics {
  console.log('Calculating financial metrics from:', JSON.stringify(calculation, null, 2));
  
  const solarPotential = calculation?.solarPotential || {};
  
  // Find the financial analysis for $35 monthly bill or use the first available
  const financialAnalysis = solarPotential.financialAnalyses?.find(
    (analysis: any) => analysis?.monthlyBill?.units === "35"
  ) || solarPotential.financialAnalyses?.[0] || {};

  const cashPurchase = financialAnalysis.cashPurchaseSavings || {};
  
  // Calculate costs
  const totalSystemCost = Number(cashPurchase.outOfPocketCost?.units || 0);
  const federalTaxCredit = Number(cashPurchase.rebateValue?.units || 0);
  const netSystemCost = totalSystemCost - federalTaxCredit;
  
  // Calculate savings
  const monthlyBillSavings = Number(financialAnalysis.monthlyBill?.units || 0);
  const annualSavings = monthlyBillSavings * 12;
  
  // Get payback period and lifetime savings
  const paybackPeriod = Number(cashPurchase.paybackYears || 0);
  const twentyYearSavings = Number(cashPurchase.savings?.savingsLifetime?.units || 0);
  const inflationAdjustedSavings = Number(cashPurchase.savings?.presentValueOfSavingsLifetime?.units || 0);

  const metrics = {
    totalSystemCost,
    federalTaxCredit,
    netSystemCost,
    monthlyBillSavings,
    annualSavings,
    paybackPeriod,
    twentyYearSavings,
    inflationAdjustedSavings
  };

  console.log('Calculated financial metrics:', metrics);
  return metrics;
}