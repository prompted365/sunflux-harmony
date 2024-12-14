interface FinancialMetrics {
  totalSystemCost: number;
  federalTaxCredit: number;
  netSystemCost: number;
  monthlyBillSavings: number;
  annualSavings: number;
  paybackPeriod: number;
  twentyYearSavings: number;
}

export function calculateFinancialMetrics(solarData: any, systemSize: number): FinancialMetrics {
  const solarPotential = solarData?.solarPotential || {};
  
  // Find the most relevant financial analysis with null checks
  const financialAnalysis = solarPotential.financialAnalyses?.find(
    (analysis: any) => analysis?.monthlyBill?.units === "35"
  ) || solarPotential.financialAnalyses?.[0] || {};

  const cashPurchase = financialAnalysis?.cashPurchaseSavings || {};
  
  // Calculate costs and savings with null checks
  const totalSystemCost = Number(cashPurchase.outOfPocketCost?.units || 0);
  const federalTaxCredit = Number(cashPurchase.rebateValue?.units || 0);
  const netSystemCost = totalSystemCost - federalTaxCredit;
  
  const monthlyBillSavings = Number(financialAnalysis?.monthlyBill?.units || 0);
  const annualSavings = monthlyBillSavings * 12;
  
  const paybackPeriod = Number(cashPurchase.paybackYears || 0);
  const twentyYearSavings = Number(cashPurchase.savings?.savingsLifetime?.units || 0);

  return {
    totalSystemCost,
    federalTaxCredit,
    netSystemCost,
    monthlyBillSavings,
    annualSavings,
    paybackPeriod,
    twentyYearSavings
  };
}