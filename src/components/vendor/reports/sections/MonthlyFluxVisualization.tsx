import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MonthlyFluxVisualizationProps {
  propertyId: string;
}

const MonthlyFluxVisualization = ({ propertyId }: MonthlyFluxVisualizationProps) => {
  const [gifUrl, setGifUrl] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchGifUrl = async () => {
      try {
        // Get the signed URL for the MonthlyFluxCompositeGIF
        const { data: signedData, error: signedError } = await supabase.storage
          .from('property-images')
          .createSignedUrl(`${propertyId}/MonthlyFluxCompositeGIF.gif`, 3600);

        if (signedError) throw signedError;

        if (signedData?.signedUrl) {
          setGifUrl(signedData.signedUrl);
        } else {
          setError('No monthly flux animation found for this property');
        }
      } catch (error) {
        console.error('Error fetching monthly flux GIF:', error);
        setError('Failed to load the monthly flux animation');
      }
    };

    if (propertyId) {
      fetchGifUrl();
    }
  }, [propertyId]);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!gifUrl) return null;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Monthly Solar Exposure</h3>
      <div className="relative aspect-video">
        <img 
          src={gifUrl} 
          alt="Monthly Solar Exposure Animation" 
          className="w-full h-full object-cover rounded-md"
          onError={() => setError('Failed to load the animation')}
        />
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        This animation shows how solar exposure changes throughout the year
      </p>
    </Card>
  );
};

export default MonthlyFluxVisualization;