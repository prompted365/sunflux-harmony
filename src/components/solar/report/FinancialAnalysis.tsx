import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { SolarCalculation } from "../types";
import { 
  calculateSavingsOverTime,
  calculatePaybackPeriod,
  calculateAnnualConsumption
} from "../utils/financialCalculations";

interface FinancialAnalysisProps {
  calc: SolarCalculation;
  financialConfig?: {
    monthlyBill: number | null;
    energyCostPerKwh: number;
    isUsingDefaults: boolean;
  };
  roiResults?: {
    payback_period: number;
    npv: number;
    irr: number;
    lifetime_production: number;
    co2_offset: number;
  } | null;
}

const FinancialAnalysis = ({ calc, financialConfig }: FinancialAnalysisProps) => {
  if (!calc.financial_analysis) return null;

  const utilityRate = financialConfig?.energyCostPerKwh || 0.15;
  const monthlyBill = financialConfig?.monthlyBill || 200; // Default monthly bill
  const initialProduction = calc.estimated_production?.yearlyEnergyDcKwh || 0;
  const installationCost = calc.financial_analysis.initialCost;
  const federalIncentive = calc.financial_analysis.federalIncentive;
  
  // Calculate savings using US-based methodology
  const savings = calculateSavingsOverTime(
    installationCost,
    monthlyBill,
    initialProduction,
    utilityRate,
    federalIncentive
  );

  const paybackPeriod = calculatePaybackPeriod(
    installationCost,
    monthlyBill,
    initialProduction,
    utilityRate,
    federalIncentive
  );

  const annualConsumption = calculateAnnualConsumption(monthlyBill, utilityRate);
  const solarPercentage = (initialProduction / annualConsumption) * 100;

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
            ${installationCost.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">Before Incentives</p>
        </div>
        <div className="space-y-2 p-4 rounded-lg bg-white/50">
          <p className="text-sm text-muted-foreground">Federal Tax Credit</p>
          <p className="text-2xl font-semibold text-green-600">
            -${federalIncentive.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">30% of System Cost</p>
        </div>
        <div className="space-y-2 p-4 rounded-lg bg-white/50">
          <p className="text-sm text-muted-foreground">Monthly Savings</p>
          <p className="text-2xl font-semibold text-primary">
            ${(savings.firstYear / 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-muted-foreground">Average Utility Savings</p>
        </div>
        <div className="space-y-2 p-4 rounded-lg bg-white/50">
          <p className="text-sm text-muted-foreground">Payback Period</p>
          <p className="text-2xl font-semibold text-primary">
            {paybackPeriod.toFixed(1)} Years
          </p>
          <p className="text-xs text-muted-foreground">Return on Investment</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 rounded-lg bg-green-50">
          <p className="font-semibold text-green-700">5-Year Savings</p>
          <p className="text-2xl font-bold text-green-600">
            ${Math.round(savings.twentyYear * (5/20)).toLocaleString()}
          </p>
        </div>
        <div className="p-4 rounded-lg bg-green-50">
          <p className="font-semibold text-green-700">10-Year Savings</p>
          <p className="text-2xl font-bold text-green-600">
            ${Math.round(savings.twentyYear * (10/20)).toLocaleString()}
          </p>
        </div>
        <div className="p-4 rounded-lg bg-green-50">
          <p className="font-semibold text-green-700">25-Year Savings</p>
          <p className="text-2xl font-bold text-green-600">
            ${Math.round(savings.lifetime).toLocaleString()}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default FinancialAnalysis;