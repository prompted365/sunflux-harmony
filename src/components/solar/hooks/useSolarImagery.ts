import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BuildingSpecs } from "../types/imagery";
import { createDataLayers, fetchDataLayers, fetchCalculationData } from "../utils/dataLayerUtils";

export const useSolarImagery = (calculationId: string) => {
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchImage = async () => {
      try {
        console.log('Fetching data layers for calculation:', calculationId);
        
        const { data: dataLayers, error: dataLayersError } = await fetchDataLayers(calculationId);

        if (dataLayersError) {
          console.error('Error fetching data layers:', dataLayersError);
          setImageError(true);
          setIsLoadingImage(false);
          toast({
            title: "Error",
            description: "Failed to fetch data layers",
            variant: "destructive",
          });
          return;
        }

        if (!dataLayers) {
          console.log('No data layers found, fetching calculation data...');
          
          const { data: calculation, error: calcError } = await fetchCalculationData(calculationId);

          if (calcError || !calculation?.building_specs) {
            console.error('Error fetching calculation:', calcError);
            setImageError(true);
            setIsLoadingImage(false);
            toast({
              title: "Error",
              description: "Failed to fetch calculation data",
              variant: "destructive",
            });
            return;
          }

          const buildingSpecs = calculation.building_specs as unknown as BuildingSpecs;
          const { error: createError } = await createDataLayers(calculationId, buildingSpecs);

          if (createError) {
            console.error('Error creating data layers:', createError);
            setImageError(true);
            setIsLoadingImage(false);
            toast({
              title: "Error",
              description: "Failed to create data layers",
              variant: "destructive",
            });
            return;
          }

          const { data: newDataLayers, error: newDataLayersError } = await fetchDataLayers(calculationId);

          if (newDataLayersError || !newDataLayers) {
            console.error('Error fetching new data layers:', newDataLayersError);
            setImageError(true);
            setIsLoadingImage(false);
            toast({
              title: "Error",
              description: "Failed to fetch new data layers",
              variant: "destructive",
            });
            return;
          }
        }

        // Process the GeoTIFF data
        const { data: processedData, error: processError } = await supabase.functions.invoke('process-geotiff', {
          body: {
            tiffUrl: dataLayers?.rgb_url,
            maskUrl: dataLayers?.mask_url,
            calculationId
          }
        });

        if (processError) {
          throw processError;
        }

        setImageUrl(processedData.url);
        setIsLoadingImage(false);

      } catch (error) {
        console.error('Error fetching image:', error);
        setImageError(true);
        setIsLoadingImage(false);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    };

    fetchImage();
  }, [calculationId]);

  return { imageUrl, imageError, isLoadingImage };
};