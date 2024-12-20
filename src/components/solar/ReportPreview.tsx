import { SolarCalculation } from "./types/calculations";
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
  return (
    <div className="space-y-8 p-6">
      <HeaderSection address={propertyAddress} />
      <SystemSpecifications calc={calc} />
      <FinancialAnalysis calc={calc} />
      <ROITimeline calc={calc} />
      <EnvironmentalImpact calc={calc} />
      <NextSteps />
    </div>
  );
};

export default ReportPreview;