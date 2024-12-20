import { Card } from "@/components/ui/card";
import { SolarCalculation } from "./types";
import SolarMetrics from "./SolarMetrics";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Trash } from "lucide-react";
import ReportPreview from "./ReportPreview";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface SolarResultCardProps {
  calc: SolarCalculation;
}

const SolarResultCard = ({ calc }: SolarResultCardProps) => {
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
      <div className="relative h-48 bg-secondary">
        <img
          src="/placeholder.svg"
          alt="Solar panel visualization"
          className="w-full h-full object-cover"
        />
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
                  propertyAddress="123 Solar Street" // TODO: Get actual address
                />
              </DialogContent>
            </Dialog>
          </>
        )}

        {calc.status === 'pending' && (
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

export default SolarResultCard;