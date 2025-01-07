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
        // List all files in the property's folder
        const { data: files, error: listError } = await supabase.storage
          .from('property-images')
          .list(propertyId);

        if (listError) throw listError;

        // Find the MonthlyFluxComposite GIF file
        // Pattern: MonthlyFluxComposite_ followed by timestamp and .gif
        const gifFile = files?.find(f => {
          const pattern = /^MonthlyFluxComposite_\d+\.gif$/;
          return pattern.test(f.name);
        });
        
        if (!gifFile) {
          console.log('Available files:', files?.map(f => f.name));
          setError('No monthly flux animation found for this property');
          return;
        }

        // Construct the public URL directly
        const publicUrl = `${supabase.getPublicUrl('property-images').data.publicUrl}/${propertyId}/${gifFile.name}`;
        setGifUrl(publicUrl);

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
      <div className="relative aspect-video w-full overflow-hidden rounded-md">
        <img 
          src={gifUrl} 
          alt="Monthly Solar Exposure Animation" 
          className="w-full h-full object-contain"
          onError={() => setError('Failed to load the animation')}
          data-component-name="MonthlyFluxVisualization"
          data-component-type="image"
        />
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        This animation shows how solar exposure changes throughout the year
      </p>
    </Card>
  );
};

export default MonthlyFluxVisualization;