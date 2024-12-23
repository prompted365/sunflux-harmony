import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Trash } from "lucide-react";
import { SolarCalculation } from "./types";
import SolarMetrics from "./SolarMetrics";
import ReportPreview from "./ReportPreview";
import GenerateHtmlButton from "@/components/GenerateHtmlButton";
import GenerateReportButton from "./GenerateReportButton";
import SolarImagery from "./SolarImagery";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SolarMetricsCardProps {
  calc: SolarCalculation;
}

const SolarMetricsCard = ({ calc }: SolarMetricsCardProps) => {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('solar_calculations')
        .delete()
        .eq('id', calc.id);

      if (error) throw error;

      toast({
        title: "Calculation deleted",
        description: "The solar calculation has been removed successfully.",
      });
    } catch (error) {
      console.error('Error deleting calculation:', error);
      toast({
        title: "Error",
        description: "Failed to delete the calculation. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card key={calc.id} className="overflow-hidden">
      <div className="relative">
        <SolarImagery calculationId={calc.id} />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 bg-white/90 hover:bg-white/75"
          onClick={handleDelete}
        >
          <Trash className="h-4 w-4 text-gray-600" />
        </Button>
        <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
          calc.status === 'completed' ? 'bg-green-100 text-green-800' : 
          'bg-yellow-100 text-yellow-800'
        }`}>
          {calc.status}
        </span>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">Solar Potential Analysis</h3>
          <p className="text-sm text-gray-500">Detailed metrics for your property</p>
        </div>

        {calc.status === 'completed' && (
          <>
            <SolarMetrics calc={calc} />
            <div className="space-y-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full gap-2">
                    <FileText className="h-4 w-4" />
                    View Report
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogTitle>Solar Installation Report</DialogTitle>
                  <ReportPreview 
                    calc={calc} 
                    propertyAddress={calc.building_specs?.address || "Property Address Unavailable"}
                  />
                  <div className="flex gap-2 mt-6">
                    <GenerateHtmlButton 
                      calculationId={calc.id}
                      filename={`solar-report-${calc.id}`}
                    />
                    <GenerateReportButton calculationId={calc.id} />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </>
        )}

        {calc.status === 'processing' && (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SolarMetricsCard;