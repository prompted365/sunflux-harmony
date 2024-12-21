import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { SolarCalculation } from "../types";
import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface ROITimelineProps {
  calc: SolarCalculation;
  financialConfig?: {
    monthlyBill: number | null;
    energyCostPerKwh: number;
    isUsingDefaults: boolean;
  };
}

const ROITimeline = ({ calc, financialConfig }: ROITimelineProps) => {
  if (!calc.financial_analysis) return null;

  const utilityRate = financialConfig?.energyCostPerKwh || 0.15; // Use config or fallback to average
  const rateInflation = 0.03; // 3% annual utility rate inflation
  const annualProduction = calc.estimated_production?.yearlyEnergyDcKwh || 0;
  const initialCost = calc.financial_analysis.initialCost;
  const federalIncentive = calc.financial_analysis.federalIncentive;
  const netCost = initialCost - federalIncentive;
  
  // Calculate cumulative savings and costs over 25 years
  const generateTimelineData = () => {
    const data = [];
    let cumulativeSavings = -netCost; // Start with negative net cost
    
    for (let year = 0; year <= 25; year++) {
      const yearlyUtilityRate = utilityRate * Math.pow(1 + rateInflation, year);
      const yearlySavings = annualProduction * yearlyUtilityRate;
      
      if (year > 0) {
        cumulativeSavings += yearlySavings;
      }
      
      data.push({
        year,
        value: Math.round(cumulativeSavings),
        savings: Math.round(yearlySavings || 0)
      });
    }
    return data;
  };

  const timelineData = generateTimelineData();
  const breakEvenYear = timelineData.find(point => point.value >= 0)?.year || 0;

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 via-background to-background">
      <h3 className="text-2xl font-semibold text-primary mb-6">Return on Investment Timeline</h3>
      
      {financialConfig?.isUsingDefaults && (
        <Alert variant="default" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Using default values for ROI calculations. Update your monthly bill and energy costs for more accurate projections.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={timelineData}
              margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
            >
              <XAxis 
                dataKey="year" 
                label={{ value: 'Years', position: 'bottom' }}
              />
              <YAxis 
                tickFormatter={(value) => `$${Math.abs(value).toLocaleString()}`}
                label={{ 
                  value: 'Cumulative Savings ($)', 
                  angle: -90, 
                  position: 'left' 
                }}
              />
              <Tooltip 
                formatter={(value: number) => [`$${Math.abs(value).toLocaleString()}`, 'Net Position']}
                labelFormatter={(label) => `Year ${label}`}
              />
              <ReferenceLine 
                y={0} 
                stroke="#666" 
                strokeDasharray="3 3" 
                label={{ value: 'Break Even', position: 'right' }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#00B2B2"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-lg bg-primary/10">
            <p className="text-sm text-muted-foreground">Initial Investment</p>
            <p className="text-2xl font-semibold text-primary">
              ${netCost.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">After federal incentive</p>
          </div>
          <div className="p-4 rounded-lg bg-green-100">
            <p className="text-sm text-green-700">Break Even Point</p>
            <p className="text-2xl font-semibold text-green-600">
              {breakEvenYear.toFixed(1)} Years
            </p>
            <p className="text-xs text-green-600">Return on investment</p>
          </div>
          <div className="p-4 rounded-lg bg-primary/10">
            <p className="text-sm text-muted-foreground">25-Year Savings</p>
            <p className="text-2xl font-semibold text-primary">
              ${Math.abs(timelineData[25].value).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Total financial benefit</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ROITimeline;