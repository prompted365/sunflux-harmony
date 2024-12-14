interface FinancialMetrics {
  totalSystemCost: number;
  federalTaxCredit: number;
  netSystemCost: number;
  monthlyBillSavings: number;
  annualSavings: number;
  paybackPeriod: number;
  twentyYearSavings: number;
}

export function calculateFinancialMetrics(
  solarData: any,
  systemSize: number
): FinancialMetrics {
  // Find the most relevant financial analysis (using $35 monthly bill scenario as default)
  const financialAnalysis = solarData.solarPotential.financialAnalyses?.find(
    (analysis: any) => analysis.monthlyBill?.units === "35"
  ) || solarData.solarPotential.financialAnalyses?.[0];

  const cashPurchase = financialAnalysis?.cashPurchaseSavings || {};
  
  // Calculate costs and savings
  const totalSystemCost = Number(cashPurchase.outOfPocketCost?.units || 0);
  const federalTaxCredit = Number(cashPurchase.rebateValue?.units || 0);
  const netSystemCost = totalSystemCost - federalTaxCredit;
  
  // Monthly and annual savings
  const monthlyBillSavings = Number(financialAnalysis?.monthlyBill?.units || 0);
  const annualSavings = monthlyBillSavings * 12;
  
  // Payback period and lifetime savings
  const paybackPeriod = Number(cashPurchase.paybackYears || 0);
  const twentyYearSavings = Number(cashPurchase.savings?.savingsYear20?.units || 0);

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