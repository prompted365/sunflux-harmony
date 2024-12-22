import { SolarCalculation } from "./types";
import HeaderSection from "./report/HeaderSection";
import SystemSpecifications from "./report/SystemSpecifications";
import FinancialAnalysis from "./report/FinancialAnalysis";
import EnvironmentalImpact from "./report/Environmental

Impact";
import ROITimeline from "./report/ROITimeline";
import NextSteps from "./report/NextSteps";

interface ReportPreviewProps {
  calc: SolarCalculation;
  propertyAddress: string;
  financialConfig?: {
    monthlyBill: number | null;
    energyCostPerKwh: number;
    isUsingDefaults: boolean;
  };
}

const ReportPreview = ({ calc, propertyAddress, financialConfig }: ReportPreviewProps) => {
  // Only render financial sections if we have financial analysis data
  const hasFinancialData = calc.financial_analysis && 
    calc.estimated_production?.yearlyEnergyDcKwh;

  return (
    <div className="space-y-8 p-6">
      <HeaderSection 
        propertyAddress={propertyAddress} 
        buildingSpecs={calc.building_specs || undefined}
      />
      <SystemSpecifications calc={calc} />
      {hasFinancialData && (
        <>
          <FinancialAnalysis 
            calc={calc} 
            financialConfig={financialConfig}
          />
          <ROITimeline 
            calc={calc}
            financialConfig={financialConfig}
          />
        </>
      )}
      <EnvironmentalImpact calc={calc} />
      <NextSteps />
    </div>
  );
};

export default ReportPreview;