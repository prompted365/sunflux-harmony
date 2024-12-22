export interface FinancialAnalysis {
  systemCost?: number;
  incentives?: {
    federal?: number;
    state?: number;
    utility?: number;
  };
  paybackPeriod?: number;
  roi?: number;
  annualSavings?: number;
  twentyYearSavings?: number;
}