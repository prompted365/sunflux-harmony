import { Card } from "@/components/ui/card";
import { SolarCalculation } from "./types";
import SolarMetrics from "./SolarMetrics";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Trash, AlertCircle } from "lucide-react";
import ReportPreview from "./ReportPreview";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface SolarResultCardProps {
  calc: SolarCalculation;
}

const SolarResultCard = ({ calc }: SolarResultCardProps) => {
  const { toast } = useToast();
  const [imageError, setImageError] = useState(false);

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

  // Get the appropriate visualization image based on calculation status
  const coverImage = calc.status === 'completed' && calc.building_specs?.imagery
    ? calc.building_specs.imagery.annualFlux || calc.building_specs.imagery.rgb
    : "/lovable-uploads/72267891-30ba-449d-a6f0-6882b77dc9e4.png";

  const handleImageError = () => {
    console.error('Failed to load image:', coverImage);
    setImageError(true);
  };

  return (
    <Card key={calc.id} className="overflow-hidden">
      <div className="relative h-48 bg-secondary">
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center text-gray-500">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Image unavailable</p>
            </div>
          </div>
        ) : (
          <img
            src={coverImage}
            alt="Solar panel analysis visualization"
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        )}
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
                <ReportPreview calculationId={calc.id} />
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
