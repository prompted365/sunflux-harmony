import { useState, useEffect } from "react";
import { AlertCircle, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { visualizeGeoTIFF, downloadCanvas } from "./utils/geoTiffVisualizer";
import { Button } from "@/components/ui/button";

interface SolarImageryProps {
  calculationId: string;
}

const SolarImagery = ({ calculationId }: SolarImageryProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

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
          // If file doesn't exist, fetch it from Google API and upload to storage
          const response = await fetch(imageKey);
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

        // If it's a GeoTIFF (annual flux), visualize it
        if (dataLayers.annual_flux_url) {
          try {
            const visualizedCanvas = await visualizeGeoTIFF(url);
            setCanvas(visualizedCanvas);
            setImageUrl(visualizedCanvas.toDataURL('image/png'));
          } catch (error) {
            console.error('Error visualizing GeoTIFF:', error);
            setImageError(true);
          }
        } else {
          // For RGB images, just set the URL directly
          setImageUrl(url);
        }
        
        setIsLoadingImage(false);
      } catch (error) {
        console.error('Error fetching image:', error);
        setImageError(true);
        setIsLoadingImage(false);
      }
    };

    fetchImage();
  }, [calculationId]);

  const handleDownload = () => {
    if (canvas) {
      downloadCanvas(canvas, `solar_analysis_${calculationId}.png`);
    }
  };

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
    <div className="relative">
      <img
        src={imageUrl}
        alt="Solar panel analysis visualization"
        className="w-full h-48 object-cover"
        onError={() => setImageError(true)}
      />
      {canvas && (
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4" />
        </Button>
      )}
    </div>
  ) : null;
};

export default SolarImagery;