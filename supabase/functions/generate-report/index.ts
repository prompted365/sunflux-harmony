import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { generateReport } from './utils/reportGenerator.ts'
import { jsPDF } from 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  try {
    const { calculationId } = await req.json()
    
    if (!calculationId) {
      throw new Error('Calculation ID is required')
    }

    console.log('Starting report generation for calculation:', calculationId)

    // Get auth user
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)

    if (userError || !user) {
      console.error('Auth error:', userError)
      throw new Error('Unauthorized')
    }

    // Check vendor profile and trial limits
    const { data: vendorProfile, error: vendorError } = await supabase
      .from('vendor_profiles')
      .select('*')
      .eq('id', user.id)
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

    // Fetch calculation data with property information
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

    // Verify vendor has access to this property
    if (calculation.properties.vendor_id !== user.id) {
      throw new Error('Unauthorized access to property')
    }

    // Get signed URLs for any images
    const getSignedUrl = async (path: string) => {
      if (!path) return null
      const { data: { signedUrl }, error } = await supabase
        .storage
        .from('solar_imagery')
        .createSignedUrl(path, 3600) // 1 hour expiry

      if (error) {
        console.error('Error getting signed URL:', error)
        return null
      }
      return signedUrl
    }

    // Transform building specs to include signed URLs
    const buildingSpecs = calculation.building_specs || {}
    if (buildingSpecs.imagery) {
      buildingSpecs.imagery = {
        ...buildingSpecs.imagery,
        rgb: await getSignedUrl(buildingSpecs.imagery.rgb),
        mask: await getSignedUrl(buildingSpecs.imagery.mask),
        dsm: await getSignedUrl(buildingSpecs.imagery.dsm)
      }
    }

    const propertyAddress = `${calculation.properties.address}, ${calculation.properties.city}, ${calculation.properties.state} ${calculation.properties.zip_code}`
    
    // Generate HTML report content
    console.log('Generating HTML report')
    const htmlContent = generateReport({
      ...calculation,
      buildingSpecs,
      propertyAddress
    })

    // Convert to PDF
    console.log('Converting to PDF')
    const doc = new jsPDF()
    
    await doc.html(htmlContent, {
      callback: async function (doc) {
        // Save PDF to storage
        const pdfBuffer = doc.output('arraybuffer')
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
        const fileName = `report_${calculationId}_${timestamp}.pdf`
        const filePath = `reports/${fileName}`

        console.log('Uploading PDF to storage')
        const { error: uploadError } = await supabase
          .storage
          .from('reports')
          .upload(filePath, pdfBuffer, {
            contentType: 'application/pdf',
            upsert: false
          })

        if (uploadError) {
          console.error('Failed to upload PDF:', uploadError)
          throw new Error('Failed to upload PDF report')
        }

        // Create signed URL
        console.log('Generating signed URL')
        const { data: { signedUrl }, error: urlError } = await supabase
          .storage
          .from('reports')
          .createSignedUrl(filePath, 60 * 60 * 24 * 7) // 7 days

        if (urlError) {
          console.error('Failed to generate URL:', urlError)
          throw new Error('Failed to generate report URL')
        }

        // Save report reference
        console.log('Saving report reference')
        const { error: reportError } = await supabase
          .from('reports')
          .insert({
            calculation_id: calculationId,
            file_path: filePath
          })

        if (reportError) {
          console.error('Failed to save report reference:', reportError)
          throw new Error('Failed to save report reference')
        }

        // Decrement trial reports if needed
        if (!vendorProfile.bypass_trial_limits && vendorProfile.account_tier === 'trial') {
          const { error: updateError } = await supabase
            .from('vendor_profiles')
            .update({ trial_reports_remaining: vendorProfile.trial_reports_remaining - 1 })
            .eq('id', user.id)

          if (updateError) {
            console.error('Failed to update trial reports count:', updateError)
          }
        }

        console.log('Report generation completed successfully')
        return new Response(
          JSON.stringify({ 
            message: 'PDF Report generated successfully',
            reportUrl: signedUrl
          }),
          { 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json'
            }
          }
        )
      },
      x: 10,
      y: 10
    })

  } catch (error) {
    console.error('Report generation error:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error instanceof Error && error.message === 'Unauthorized' ? 401 : 500
      }
    )
  }
})