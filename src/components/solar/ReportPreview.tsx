import { SolarCalculation } from "./types";
import HeaderSection from "./report/HeaderSection";
import SystemSpecifications from "./report/SystemSpecifications";
import FinancialAnalysis from "./report/FinancialAnalysis";
import EnvironmentalImpact from "./report/EnvironmentalImpact";
import ROITimeline from "./report/ROITimeline";
import ProcessingStatus from "./report/ProcessingStatus";
import NextSteps from "./report/NextSteps";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  // Fetch ROI results for this calculation
  const { data: roiResults } = useQuery({
    queryKey: ['roi-results', calc.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('roi_results')
        .select('*')
        .eq('calculation_id', calc.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!calc.id
  });

  // Fetch processing status
  const { data: processingJob } = useQuery({
    queryKey: ['processing-job', calc.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('processing_jobs')
        .select('*')
        .eq('calculation_id', calc.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!calc.id
  });

  // Only render financial sections if we have financial analysis data
  const hasFinancialData = calc.financial_analysis && 
    calc.estimated_production?.yearlyEnergyDcKwh;

  return (
    <div className="space-y-8 p-6">
      <HeaderSection 
        propertyAddress={propertyAddress} 
        buildingSpecs={calc.building_specs || undefined}
      />
      
      <ProcessingStatus 
        status={processingJob?.status || 'pending'}
        error={processingJob?.error_message}
      />
      
      <SystemSpecifications calc={calc} />
      
      {hasFinancialData && (
        <>
          <FinancialAnalysis 
            calc={calc} 
            financialConfig={financialConfig}
            roiResults={roiResults}
          />
          <ROITimeline 
            calc={calc}
            financialConfig={financialConfig}
            roiResults={roiResults}
          />
        </>
      )}
      
      <EnvironmentalImpact 
        calc={calc}
        roiResults={roiResults}
      />
      
      <NextSteps />
    </div>
  );
};

export default ReportPreview;