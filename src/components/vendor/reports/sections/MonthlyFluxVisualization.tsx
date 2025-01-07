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
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const processAndFetchGif = async () => {
      try {
        setIsLoading(true);
        setError('');

        // First, call the convert-to-gif function
        const { data, error: functionError } = await supabase.functions.invoke('convert-to-gif', {
          body: { propertyId }
        });

        if (functionError) {
          console.error('Error calling convert-to-gif function:', functionError);
          throw new Error('Failed to process the visualization');
        }

        if (!data?.url) {
          throw new Error('No URL returned from the function');
        }

        setImageUrl(data.url);
        
      } catch (error) {
        console.error('Error processing monthly flux GIF:', error);
        setError(error.message);
        toast({
          title: "Error loading visualization",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
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

  if (!imageUrl && !isLoading) return null;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Monthly Solar Exposure</h3>
      <div className="relative aspect-video w-full overflow-hidden rounded-md">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <img 
            src={imageUrl} 
            alt="Monthly Solar Exposure Animation" 
            className="w-full h-full object-contain"
            onError={() => {
              setError('Failed to load the animation');
              toast({
                title: "Error",
                description: "Failed to load the visualization",
                variant: "destructive",
              });
            }}
          />
        )}
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        This animation shows how solar exposure changes throughout the year
      </p>
    </Card>
  );
};

export default MonthlyFluxVisualization;