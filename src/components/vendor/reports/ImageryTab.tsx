import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { ImageryResponse } from "../types";

interface ImageryTabProps {
  propertyId: string;
}

const ImageryTab = ({ propertyId }: ImageryTabProps) => {
  const { data, isLoading } = useQuery<ImageryResponse>({
    queryKey: ['property-imagery', propertyId],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-property-imagery', {
        body: { propertyId }
      });

      if (error) throw error;
      return data;
    },
    refetchInterval: (data) => {
      // Refetch every 10 seconds if imagery is still being processed
      return data?.imagery_status === 'pending' ? 10000 : false;
    }
  });

  // Helper function to get display name for image type
  const getDisplayName = (type: string) => {
    const displayNames: Record<string, string> = {
      RGB: 'Satellite View',
      DSM: 'Surface Model',
      Mask: 'Roof Mask Analysis',
      AnnualFlux: 'Annual Solar Analysis',
      FluxOverRGB: 'Solar Analysis Overlay',
      MonthlyFluxCompositeGIF: 'Monthly Solar Analysis'
    };
    return displayNames[type] || type;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data?.success) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load imagery data.
        </AlertDescription>
      </Alert>
    );
  }

  if (data.imagery_status === 'pending') {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Solar imagery is being processed. This may take a few minutes.
          Current status: {data.status || 'initializing'}
        </AlertDescription>
      </Alert>
    );
  }

  // Get all available single images
  const availableImages = Object.entries(data.urls)
    .filter(([type]) => !Array.isArray(data.urls[type]))
    .map(([type, url]) => ({
      url: url as string,
      displayName: getDisplayName(type),
      type
    }));

  if (!availableImages.length) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No imagery is available yet for this property.
          The system is still processing the solar analysis.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {availableImages.map((image, index) => (
        <Card key={index} className="overflow-hidden">
          <div className="aspect-video relative">
            <img
              src={image.url}
              alt={`Solar analysis - ${image.displayName}`}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <p className="text-sm font-medium">{image.displayName}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ImageryTab;