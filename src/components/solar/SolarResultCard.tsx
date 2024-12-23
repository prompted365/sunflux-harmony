import { Card } from "@/components/ui/card";
import { SolarCalculation } from "./types";
import SolarMetrics from "./SolarMetrics";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Trash, AlertCircle, Loader2 } from "lucide-react";
import ReportPreview from "./ReportPreview";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import GenerateHtmlButton from "@/components/GenerateHtmlButton";
import GenerateReportButton from "./GenerateReportButton";

interface SolarResultCardProps {
  calc: SolarCalculation;
}

const SolarResultCard = ({ calc }: SolarResultCardProps) => {
  const { toast } = useToast();
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [isProcessing, setIsProcessing] = useState(calc.status === 'processing');

  useEffect(() => {
    const subscription = supabase
      .channel('solar_calculations_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'solar_calculations',
          filter: `id=eq.${calc.id}`,
        },
        (payload) => {
          const updatedCalc = payload.new as SolarCalculation;
          setIsProcessing(updatedCalc.status === 'processing');
          if (updatedCalc.status === 'completed') {
            fetchImage();
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [calc.id]);

  const fetchImage = async () => {
    if (!calc.building_specs?.imagery) {
      setIsLoadingImage(false);
      setImageError(true);
      return;
    }

    try {
      // Get the data layers for this calculation
      const { data: dataLayers, error: dataLayersError } = await supabase
        .from('data_layers')
        .select('*')
        .eq('calculation_id', calc.id)
        .maybeSingle();

      if (dataLayersError) {
        console.error('Error fetching data layers:', dataLayersError);
        setImageError(true);
        setIsLoadingImage(false);
        return;
      }

      // If no data layers found, show error state
      if (!dataLayers) {
        console.log('No data layers found for calculation:', calc.id);
        setImageError(true);
        setIsLoadingImage(false);
        return;
      }

      // Try to get the annual flux image first, then fall back to RGB
      const imageKey = dataLayers.annual_flux_url || dataLayers.rgb_url;
      
      if (!imageKey) {
        console.error('No imagery available for calculation:', calc.id);
        setImageError(true);
        setIsLoadingImage(false);
        return;
      }

      // Get a signed URL for the image
      const { data: { signedUrl }, error } = await supabase
        .storage
        .from('solar_imagery')
        .createSignedUrl(imageKey, 3600);

      if (error) {
        console.error('Error getting signed URL:', error);
        setImageError(true);
        setIsLoadingImage(false);
        return;
      }

      setImageUrl(signedUrl);
      setIsLoadingImage(false);
    } catch (error) {
      console.error('Error fetching image:', error);
      setImageError(true);
      setIsLoadingImage(false);
    }
  };

  useEffect(() => {
    fetchImage();
  }, [calc.id]);

  const handleImageError = () => {
    console.error('Failed to load image');
    setImageError(true);
  };

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
        {isProcessing ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center text-gray-500">
              <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin" />
              <p className="text-sm">Processing solar analysis...</p>
            </div>
          </div>
        ) : imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center text-gray-500">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Image unavailable</p>
            </div>
          </div>
        ) : isLoadingImage ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="animate-pulse">
              <div className="h-8 w-8 bg-gray-200 rounded-full mx-auto mb-2" />
              <p className="text-sm text-gray-400">Loading image...</p>
            </div>
          </div>
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt="Solar panel analysis visualization"
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : null}
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
                      htmlContent={`Report for ${calc.building_specs?.address || 'Property'}`}
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

export default SolarResultCard;