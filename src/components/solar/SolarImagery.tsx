import { useState, useEffect } from "react";
import { AlertCircle, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { visualizeGeoTIFF, downloadCanvas } from "./utils/geoTiffVisualizer";
import { Button } from "@/components/ui/button";
import { LayerControls } from "./utils/layers/LayerControls";
import { LayerType, LAYER_CONFIGS } from "./utils/layers/LayerTypes";
import { LayerRenderer } from "./utils/layers/LayerRenderer";

interface SolarImageryProps {
  calculationId: string;
}

const SolarImagery = ({ calculationId }: SolarImageryProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [visibleLayers, setVisibleLayers] = useState<Record<LayerType, boolean>>(() => {
    const initial: Record<LayerType, boolean> = {} as Record<LayerType, boolean>;
    Object.entries(LAYER_CONFIGS).forEach(([id, config]) => {
      initial[id as LayerType] = config.defaultVisible;
    });
    return initial;
  });

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
        const rgbUrl = dataLayers.rgb_url;
        const annualFluxUrl = dataLayers.annual_flux_url;

        // Initialize layer renderer
        const width = 800; // Set appropriate width
        const height = 600; // Set appropriate height
        const renderer = new LayerRenderer(width, height);

        // Render layers based on visibility
        if (visibleLayers.rgb && rgbUrl) {
          const rgbData = await visualizeGeoTIFF(rgbUrl);
          renderer.renderRGB(rgbData, { opacity: 1 });
        }

        if (visibleLayers.annual_flux && annualFluxUrl) {
          const annualFluxData = await visualizeGeoTIFF(annualFluxUrl);
          renderer.renderPalette(annualFluxData, {
            min: 0,
            max: 100, // Set appropriate max value
            opacity: 0.7,
            colormap: LAYER_CONFIGS.annual_flux.colormap
          });
        }

        // Set the canvas and image URL
        setCanvas(renderer.getCanvas());
        setImageUrl(renderer.getCanvas().toDataURL('image/png'));
        setIsLoadingImage(false);
      } catch (error) {
        console.error('Error fetching image:', error);
        setImageError(true);
        setIsLoadingImage(false);
      }
    };

    fetchImage();
  }, [calculationId, visibleLayers]);

  const handleToggleLayer = (layerId: LayerType) => {
    setVisibleLayers(prev => ({
      ...prev,
      [layerId]: !prev[layerId]
    }));
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
    <div className="space-y-4">
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
            onClick={() => downloadCanvas(canvas, `solar_analysis_${calculationId}.png`)}
          >
            <Download className="h-4 w-4" />
          </Button>
        )}
      </div>
      <LayerControls 
        visibleLayers={visibleLayers}
        onToggleLayer={handleToggleLayer}
      />
    </div>
  ) : null;
};

export default SolarImagery;
