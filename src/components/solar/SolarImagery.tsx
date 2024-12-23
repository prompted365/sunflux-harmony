import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SolarImageryProps {
  calculationId: string;
}

const SolarImagery = ({ calculationId }: SolarImageryProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        // Get the data layers for this calculation
        const { data: dataLayers, error: dataLayersError } = await supabase
          .from('data_layers')
          .select('*')
          .eq('calculation_id', calculationId)
          .maybeSingle();

        if (dataLayersError) {
          console.error('Error fetching data layers:', dataLayersError);
          setImageError(true);
          setIsLoadingImage(false);
          return;
        }

        // If no data layers found, show error state
        if (!dataLayers) {
          console.log('No data layers found for calculation:', calculationId);
          setImageError(true);
          setIsLoadingImage(false);
          return;
        }

        // Try to get the annual flux image first, then fall back to RGB
        const imageKey = dataLayers.annual_flux_url || dataLayers.rgb_url;
        
        if (!imageKey) {
          console.error('No imagery available for calculation:', calculationId);
          setImageError(true);
          setIsLoadingImage(false);
          return;
        }

        // Extract just the filename from the URL
        const filename = imageKey.split('/').pop();
        if (!filename) {
          throw new Error('Invalid image URL format');
        }

        // Get a signed URL for the image
        const { data: { signedUrl }, error } = await supabase
          .storage
          .from('solar_imagery')
          .createSignedUrl(filename, 3600); // 1 hour expiry

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

    fetchImage();
  }, [calculationId]);

  if (isLoadingImage) {
    return (
      <div className="w-full h-48 flex items-center justify-center bg-gray-100">
        <div className="animate-pulse">
          <div className="h-8 w-8 bg-gray-200 rounded-full mx-auto mb-2" />
          <p className="text-sm text-gray-400">Loading image...</p>
        </div>
      </div>
    );
  }

  if (imageError) {
    return (
      <div className="w-full h-48 flex items-center justify-center bg-gray-100">
        <div className="text-center text-gray-500">
          <AlertCircle className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm">Image unavailable</p>
        </div>
      </div>
    );
  }

  return imageUrl ? (
    <img
      src={imageUrl}
      alt="Solar panel analysis visualization"
      className="w-full h-48 object-cover"
      onError={() => setImageError(true)}
    />
  ) : null;
};

export default SolarImagery;