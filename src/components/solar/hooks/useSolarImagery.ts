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

        // Try to get the annual flux image first, then fall back to RGB
        const imageKey = dataLayers?.annual_flux_url || dataLayers?.rgb_url;
        
        if (!imageKey) {
          console.error('No imagery available for calculation:', calculationId);
          setImageError(true);
          setIsLoadingImage(false);
          toast({
            title: "Error",
            description: "No imagery available",
            variant: "destructive",
          });
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

        if (!existingFile || existingFile.length === 0) {
          console.log('File does not exist, fetching from Google API...');
          
          const { data: imageData, error: fetchError } = await supabase.functions.invoke('process-solar-imagery', {
            body: { 
              imageUrl: imageKey,
              calculationId
            }
          });

          if (fetchError) {
            throw fetchError;
          }

          const { error: uploadError } = await supabase
            .storage
            .from('solar_imagery')
            .upload(filename, imageData);

          if (uploadError) throw uploadError;
        }

        const { data: { signedUrl: url }, error: signedUrlError } = await supabase
          .storage
          .from('solar_imagery')
          .createSignedUrl(filename, 3600);

        if (signedUrlError) throw signedUrlError;

        setImageUrl(url);
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