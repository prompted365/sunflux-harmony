import { createClient } from '@supabase/supabase-js';

export async function validateVendorAccess(userId: string, calculationId: string, supabase: ReturnType<typeof createClient>) {
  // Check if user has access to this calculation
  const { data: calculation, error: calcError } = await supabase
    .from('solar_calculations')
    .select(`
      id,
      property_id,
      properties (
        vendor_id,
        user_id
      )
    `)
    .eq('id', calculationId)
    .single();

  if (calcError || !calculation) {
    console.error('Error fetching calculation:', calcError);
    throw new Error('Failed to validate access');
  }

  // Check if user owns the property or is the vendor
  if (calculation.properties.user_id !== userId && calculation.properties.vendor_id !== userId) {
    throw new Error('Unauthorized access to calculation');
  }

  // If user is a vendor, check trial limits
  if (calculation.properties.vendor_id === userId) {
    const { data: vendorProfile, error: vendorError } = await supabase
      .from('vendor_profiles')
      .select('trial_reports_remaining, account_tier, bypass_trial_limits')
      .eq('id', userId)
      .single();

    if (vendorError || !vendorProfile) {
      console.error('Error fetching vendor profile:', vendorError);
      throw new Error('Failed to validate vendor profile');
    }

    if (!vendorProfile.bypass_trial_limits && 
        vendorProfile.account_tier === 'trial' && 
        vendorProfile.trial_reports_remaining <= 0) {
      throw new Error('No trial reports remaining');
    }
  }

  return calculation;
}

export async function decrementTrialReports(userId: string, supabase: ReturnType<typeof createClient>) {
  const { error } = await supabase
    .from('vendor_profiles')
    .update({ 
      trial_reports_remaining: supabase.rpc('decrement', { x: 1 })
    })
    .eq('id', userId)
    .eq('account_tier', 'trial')
    .eq('bypass_trial_limits', false);

  if (error) {
    console.error('Error updating trial reports:', error);
  }
}