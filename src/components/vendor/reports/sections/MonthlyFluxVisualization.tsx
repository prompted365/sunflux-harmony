import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface MonthlyFluxVisualizationProps {
  propertyId: string;
}

const MonthlyFluxVisualization = ({ propertyId }: MonthlyFluxVisualizationProps) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    const processAndFetchGif = async () => {
      try {
        // First, call the convert-to-gif function
        const { error: conversionError } = await supabase.functions.invoke('convert-to-gif', {
          body: { propertyId }
        });

        if (conversionError) throw conversionError;

        // After conversion, list files to get the GIF
        const { data: files, error: listError } = await supabase.storage
          .from('property-images')
          .list(propertyId);

        if (listError) throw listError;

        // Find the composite GIF file
        const compositeFile = files?.find(f => {
          const pattern = /^MonthlyFluxComposite_\d+\.gif$/;
          return pattern.test(f.name);
        });
        
        if (!compositeFile) {
          console.log('Available files:', files?.map(f => f.name));
          throw new Error('No monthly flux animation found for this property');
        }

        // Get the public URL for the GIF
        const { data } = supabase.storage
          .from('property-images')
          .getPublicUrl(`${propertyId}/${compositeFile.name}`);

        setImageUrl(data.publicUrl);

      } catch (error) {
        console.error('Error processing monthly flux GIF:', error);
        setError(error.message);
        toast({
          title: "Error loading visualization",
          description: error.message,
          variant: "destructive",
        });
      }
    };

    if (propertyId) {
      processAndFetchGif();
    }
  }, [propertyId, toast]);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!imageUrl) return null;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Monthly Solar Exposure</h3>
      <div className="relative aspect-video w-full overflow-hidden rounded-md">
        <img 
          src={imageUrl} 
          alt="Monthly Solar Exposure Animation" 
          className="w-full h-full object-contain"
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