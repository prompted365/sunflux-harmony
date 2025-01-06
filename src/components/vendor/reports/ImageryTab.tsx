import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

interface ImageryTabProps {
  propertyId: string;
}

const ImageryTab = ({ propertyId }: ImageryTabProps) => {
  const { data: property, isLoading: propertyLoading } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", propertyId)
        .single();

      if (error) throw error;
      return data;
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

  // Get all available imagery for the property
  const getAvailableImagery = () => {
    if (!property) return [];

    const imageTypes = [
      'DSM',
      'RGB',
      'Mask',
      'AnnualFlux',
      'FluxOverRGB',
      'MonthlyFluxCompositeGIF'
    ];

    return imageTypes
      .filter(type => property[type as keyof typeof property])
      .map(type => ({
        url: property[type as keyof typeof property] as string,
        displayName: getDisplayName(type),
        type
      }));
  };

  if (propertyLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!property) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Property not found.
        </AlertDescription>
      </Alert>
    );
  }

  if (property.status !== 'completed') {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Solar imagery is being processed. This may take a few minutes.
          Current status: {property.status || 'initializing'}
        </AlertDescription>
      </Alert>
    );
  }

  const availableImages = getAvailableImagery();

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