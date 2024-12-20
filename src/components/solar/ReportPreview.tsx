import { SolarCalculation } from "./types";
import HeaderSection from "./report/HeaderSection";
import SystemSpecifications from "./report/SystemSpecifications";
import FinancialAnalysis from "./report/FinancialAnalysis";
import EnvironmentalImpact from "./report/EnvironmentalImpact";
import ROITimeline from "./report/ROITimeline";
import NextSteps from "./report/NextSteps";

interface ReportPreviewProps {
  calc: SolarCalculation;
  propertyAddress: string;
}

const ReportPreview = ({ calc, propertyAddress }: ReportPreviewProps) => {
  // Only render if we have financial analysis data
  const hasFinancialData = calc.financial_analysis && 
    calc.estimated_production?.yearlyEnergyDcKwh;

  return (
    <div className="space-y-8 p-6">
      <HeaderSection propertyAddress={propertyAddress} />
      <SystemSpecifications calc={calc} />
      {hasFinancialData && (
        <>
          <FinancialAnalysis calc={calc} />
          <ROITimeline calc={calc} />
        </>
      )}
      <EnvironmentalImpact calc={calc} />
      <NextSteps />
    </div>
  );
};

export default ReportPreview;