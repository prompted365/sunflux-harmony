import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

export async function validateVendorAccess(supabase: SupabaseClient, userId: string) {
  const { data: vendorProfile, error: vendorError } = await supabase
    .from('vendor_profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (vendorError) {
    console.error('Vendor profile error:', vendorError)
    throw new Error('Failed to fetch vendor profile')
  }

  if (!vendorProfile.bypass_trial_limits && 
      vendorProfile.account_tier === 'trial' && 
      vendorProfile.trial_reports_remaining <= 0) {
    throw new Error('No trial reports remaining')
  }

  return vendorProfile
}