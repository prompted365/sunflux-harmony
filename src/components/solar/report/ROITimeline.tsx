import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { SolarCalculation } from "../types";
import ROIChart from "./roi/ROIChart";
import ROIMetrics from "./roi/ROIMetrics";

interface ROITimelineProps {
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

const ROITimeline = ({ calc, financialConfig, roiResults }: ROITimelineProps) => {
  if (!calc.financial_analysis) return null;

  const utilityRate = financialConfig?.energyCostPerKwh || 0.15;
  const rateInflation = 0.03; // 3% annual utility rate inflation
  const annualProduction = calc.estimated_production?.yearlyEnergyDcKwh || 0;
  const initialCost = calc.financial_analysis.initialCost;
  const federalIncentive = calc.financial_analysis.federalIncentive;
  const netCost = initialCost - federalIncentive;
  
  // Use ROI results if available, otherwise calculate
  const breakEvenYear = roiResults?.payback_period || 
    generateTimelineData().find(point => point.value >= 0)?.year || 0;
  
  const lifetimeSavings = roiResults?.npv || 
    generateTimelineData()[25].value;

  // Calculate cumulative savings and costs over 25 years
  function generateTimelineData() {
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
        <ROIChart 
          timelineData={timelineData} 
          breakEvenYear={breakEvenYear}
        />
        <ROIMetrics 
          netCost={netCost}
          breakEvenYear={breakEvenYear}
          lifetimeSavings={lifetimeSavings}
          irr={roiResults?.irr}
          lifetimeProduction={roiResults?.lifetime_production}
          co2Offset={roiResults?.co2_offset}
        />
      </div>
    </Card>
  );
};

export default ROITimeline;