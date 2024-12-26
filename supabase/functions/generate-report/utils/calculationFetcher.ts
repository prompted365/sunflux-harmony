import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

export async function fetchCalculationData(supabase: SupabaseClient, calculationId: string, userId: string) {
  const { data: calculation, error: calcError } = await supabase
    .from('solar_calculations')
    .select(`
      *,
      properties (
        id,
        address,
        city,
        state,
        zip_code,
        vendor_id
      )
    `)
    .eq('id', calculationId)
    .single()

  if (calcError || !calculation) {
    console.error('Failed to fetch calculation:', calcError)
    throw new Error('Failed to fetch calculation data')
  }

  if (calculation.properties.vendor_id !== userId) {
    throw new Error('Unauthorized access to property')
  }

  return calculation
}