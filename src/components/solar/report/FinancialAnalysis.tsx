import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { SolarCalculation } from "../types";

interface FinancialAnalysisProps {
  calc: SolarCalculation;
  financialConfig?: {
    monthlyBill: number | null;
    energyCostPerKwh: number;
    isUsingDefaults: boolean;
  };
}

const FinancialAnalysis = ({ calc, financialConfig }: FinancialAnalysisProps) => {
  if (!calc.financial_analysis) return null;

  const utilityRate = financialConfig?.energyCostPerKwh || 0.15; // Use config or fallback to average
  const rateInflation = 0.03; // 3% annual utility rate inflation
  const annualProduction = calc.estimated_production?.yearlyEnergyDcKwh || 0;
  
  // Calculate savings over different periods
  const calculateSavings = (years: number) => {
    let totalSavings = 0;
    for (let i = 0; i < years; i++) {
      const inflatedRate = utilityRate * Math.pow(1 + rateInflation, i);
      totalSavings += annualProduction * inflatedRate;
    }
    return totalSavings;
  };

  const savings = {
    fiveYear: calculateSavings(5),
    tenYear: calculateSavings(10),
    twentyFiveYear: calculateSavings(25)
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 via-background to-background border-2">
      <h3 className="text-2xl font-semibold text-primary mb-6">Financial Benefits</h3>
      
      {financialConfig?.isUsingDefaults && (
        <Alert variant="default" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Using default values for financial calculations. Update your monthly bill and energy costs for more accurate estimates.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-2 p-4 rounded-lg bg-white/50">
          <p className="text-sm text-muted-foreground">Initial Investment</p>
          <p className="text-2xl font-semibold text-primary">
            ${calc.financial_analysis.initialCost.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">Before Incentives</p>
        </div>
        <div className="space-y-2 p-4 rounded-lg bg-white/50">
          <p className="text-sm text-muted-foreground">Federal Tax Credit</p>
          <p className="text-2xl font-semibold text-green-600">
            -${calc.financial_analysis.federalIncentive.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">30% of System Cost</p>
        </div>
        <div className="space-y-2 p-4 rounded-lg bg-white/50">
          <p className="text-sm text-muted-foreground">Monthly Savings</p>
          <p className="text-2xl font-semibold text-primary">
            ${calc.financial_analysis.monthlyBillSavings.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">Average Utility Savings</p>
        </div>
        <div className="space-y-2 p-4 rounded-lg bg-white/50">
          <p className="text-sm text-muted-foreground">Payback Period</p>
          <p className="text-2xl font-semibold text-primary">
            {calc.financial_analysis.paybackYears.toFixed(1)} Years
          </p>
          <p className="text-xs text-muted-foreground">Return on Investment</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 rounded-lg bg-green-50">
          <p className="font-semibold text-green-700">5-Year Savings</p>
          <p className="text-2xl font-bold text-green-600">${Math.round(savings.fiveYear).toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-lg bg-green-50">
          <p className="font-semibold text-green-700">10-Year Savings</p>
          <p className="text-2xl font-bold text-green-600">${Math.round(savings.tenYear).toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-lg bg-green-50">
          <p className="font-semibold text-green-700">25-Year Savings</p>
          <p className="text-2xl font-bold text-green-600">${Math.round(savings.twentyFiveYear).toLocaleString()}</p>
        </div>
      </div>
    </Card>
  );
};

export default FinancialAnalysis;