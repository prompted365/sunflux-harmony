import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ImageryResponse } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { ImageItem } from "./ImageItem";
import { LoadingAlert } from "./LoadingAlert";
import { ErrorAlert } from "./ErrorAlert";
import { useImageryUpdates } from "./useImageryUpdates";

interface ImageryTabProps {
  propertyId: string;
}

const ImageryTab = ({ propertyId }: ImageryTabProps) => {
  const queryClient = useQueryClient();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['property-imagery', propertyId],
    queryFn: async () => {
      if (!propertyId) throw new Error('Property ID is required');
      
      const { data, error } = await supabase.functions.invoke('get-property-imagery', {
        body: { propertyId }
      });

      if (error) throw error;
      return data as ImageryResponse;
    },
    enabled: !!propertyId
  });

  // Set up realtime updates
  useImageryUpdates(propertyId, queryClient);

  if (isLoading) return <LoadingAlert />;
  if (error) return <ErrorAlert />;
  if (!data) return <ErrorAlert message="No data available" />;

  if (data.property.imagery_status === 'pending') {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Imagery processing is in progress. This may take a few minutes.
        </AlertDescription>
      </Alert>
    );
  }

  if (data.property.imagery_status === 'failed') {
    return <ErrorAlert message="Failed to process imagery. Please try again later." />;
  }

  // Get all available single images from the signed URLs
  const availableImages = Object.entries(data.urls || {})
    .filter(([type, url]) => typeof url === 'string' && !Array.isArray(url))
    .map(([type, url]) => ({
      url: url as string,
      title: type.replace(/([A-Z])/g, ' $1').trim() // Add spaces before capital letters
    }));

  if (availableImages.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No imagery available yet.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {availableImages.map(({ url, title }) => (
        <ImageItem key={title} url={url} title={title} />
      ))}
    </div>
  );
};

export default ImageryTab;