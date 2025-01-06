import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { ImageryResponse } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ImageItem } from "./ImageItem";

interface ImageryTabProps {
  propertyId: string;
}

const ImageryTab = ({ propertyId }: ImageryTabProps) => {
  const { toast } = useToast();
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['property-imagery', propertyId],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-property-imagery', {
        body: { property_id: propertyId }
      });

      if (error) throw error;
      return data as ImageryResponse;
    }
  });

  // Subscribe to property changes
  useEffect(() => {
    const channel = supabase
      .channel('imagery-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'properties',
          filter: `id=eq.${propertyId}`,
        },
        () => {
          refetch();
          toast({
            title: "New imagery available",
            description: "Solar analysis images have been updated.",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [propertyId, refetch, toast]);

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <ImageItem key={i} url="" title="" isLoading />
        ))}
      </div>
    );
  }

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
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to process imagery. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  // Get all available single images from the signed URLs
  const availableImages = Object.entries(data.urls || {})
    .filter(([type, url]) => typeof url === 'string' && !Array.isArray(url))
    .map(([type, url]) => ({
      type,
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
      {availableImages.map(({ type, url, title }) => (
        <ImageItem key={type} url={url} title={title} />
      ))}
    </div>
  );
};

export default ImageryTab;