import { supabase } from "@/integrations/supabase/client";
import { BuildingSpecs } from "../types/imagery";

export const formatDate = (date?: { year: number; month: number; day: number }) => {
  if (!date) return null;
  return new Date(date.year, date.month - 1, date.day).toISOString();
};

export const createDataLayers = async (calculationId: string, buildingSpecs: BuildingSpecs) => {
  const { error: insertError } = await supabase
    .from('data_layers')
    .insert({
      calculation_id: calculationId,
      imagery_date: formatDate(buildingSpecs.imageryDate),
      imagery_processed_date: formatDate(buildingSpecs.imageryProcessedDate),
      dsm_url: buildingSpecs.imagery?.dsm || null,
      rgb_url: buildingSpecs.imagery?.rgb || null,
      mask_url: buildingSpecs.imagery?.mask || null,
      annual_flux_url: buildingSpecs.imagery?.annualFlux || null,
      monthly_flux_url: buildingSpecs.imagery?.monthlyFlux || null,
      imagery_quality: buildingSpecs.imageryQuality,
      raw_response: buildingSpecs as unknown as Json
    });

  return { error: insertError };
};

export const fetchDataLayers = async (calculationId: string) => {
  return await supabase
    .from('data_layers')
    .select('*')
    .eq('calculation_id', calculationId)
    .maybeSingle();
};

export const fetchCalculationData = async (calculationId: string) => {
  return await supabase
    .from('solar_calculations')
    .select('building_specs')
    .eq('id', calculationId)
    .maybeSingle();
};