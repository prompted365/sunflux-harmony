import { createClient } from '@supabase/supabase-js';
import { corsHeaders } from './cors.ts';

interface DataLayer {
  dsm_url: string;
  rgb_url: string;
  mask_url: string;
  annual_flux_url: string;
  monthly_flux_url: string;
  hourly_shade_urls: string[];
}

export async function fetchDataLayers(calculationId: string, supabase: ReturnType<typeof createClient>): Promise<DataLayer> {
  const { data: dataLayers, error } = await supabase
    .from('data_layers')
    .select('*')
    .eq('calculation_id', calculationId)
    .single();

  if (error) {
    console.error('Error fetching data layers:', error);
    throw new Error('Failed to fetch data layers');
  }

  if (!dataLayers) {
    throw new Error('No data layers found for calculation');
  }

  return dataLayers;
}