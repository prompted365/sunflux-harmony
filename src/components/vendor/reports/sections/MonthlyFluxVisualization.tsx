import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface MonthlyFluxVisualizationProps {
  propertyId: string;
}

const MonthlyFluxVisualization = ({ propertyId }: MonthlyFluxVisualizationProps) => {
  const [gifUrl, setGifUrl] = useState<string>('');

  useEffect(() => {
    const fetchGifUrl = async () => {
      try {
        // List all files in the property's folder
        const { data: files, error: listError } = await supabase.storage
          .from('property-images')
          .list(propertyId);

        if (listError) throw listError;

        // Find the monthly flux composite GIF by matching the property ID portion before the timestamp
        const gifFile = files?.find(f => {
          const [filePropertyId] = f.name.split('_');
          return filePropertyId === propertyId;
        });
        
        if (gifFile) {
          const { data } = await supabase.storage
            .from('property-images')
            .createSignedUrl(`${propertyId}/${gifFile.name}`, 3600);

          if (data?.signedUrl) {
            setGifUrl(data.signedUrl);
          }
        }
      } catch (error) {
        console.error('Error fetching monthly flux GIF:', error);
      }
    };

    fetchGifUrl();
  }, [propertyId]);

  if (!gifUrl) return null;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Monthly Solar Exposure</h3>
      <div className="relative aspect-video">
        <img 
          src={gifUrl} 
          alt="Monthly Solar Exposure Animation" 
          className="w-full h-full object-cover rounded-md"
        />
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        This animation shows how solar exposure changes throughout the year
      </p>
    </Card>
  );
};

export default MonthlyFluxVisualization;