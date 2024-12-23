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

        // Get the API key from Supabase edge function
        const { data: { GOOGLE_MAPS_API_KEY } } = await supabase.functions.invoke('get-secret', {
          body: { name: 'GOOGLE_MAPS_API_KEY' }
        });

        if (!GOOGLE_MAPS_API_KEY) {
          console.error('Failed to get Google Maps API key');
          setImageError(true);
          setIsLoadingImage(false);
          return;
        }

        // Generate a unique filename for storage
        const uniqueId = imageKey.split('id=').pop()?.split('&')[0];
        if (!uniqueId) {
          throw new Error('Could not extract unique ID from image URL');
        }
        const filename = `${calculationId}-${uniqueId}.tiff`;

        // First check if the file exists in storage
        const { data: existingFile } = await supabase
          .storage
          .from('solar_imagery')
          .list('', {
            search: filename
          });

        let signedUrl;
        if (!existingFile || existingFile.length === 0) {
          // If file doesn't exist, fetch it from Google API with API key
          const solarUrl = `${imageKey}&key=${GOOGLE_MAPS_API_KEY}`;
          const response = await fetch(solarUrl);
          if (!response.ok) {
            throw new Error('Failed to fetch image from Google API');
          }
          const blob = await response.blob();
          
          const { error: uploadError } = await supabase
            .storage
            .from('solar_imagery')
            .upload(filename, blob);

          if (uploadError) {
            throw uploadError;
          }
        }

        // Get a signed URL for the image
        const { data: { signedUrl: url }, error: signedUrlError } = await supabase
          .storage
          .from('solar_imagery')
          .createSignedUrl(filename, 3600); // 1 hour expiry

        if (signedUrlError) {
          throw signedUrlError;
        }

        setImageUrl(url);
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