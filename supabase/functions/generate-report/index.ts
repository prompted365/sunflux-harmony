import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"
import { validateAuth } from './utils/auth.ts'
import { validateVendorAccess } from './utils/vendorValidation.ts'
import { fetchCalculationData } from './utils/calculationFetcher.ts'
import { processReport } from './utils/reportProcessor.ts'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting report generation request')
    
    const { calculationId } = await req.json()
    
    if (!calculationId) {
      throw new Error('Calculation ID is required')
    }

    console.log('Validating auth and vendor profile...')
    const { user, supabase } = await validateAuth(req.headers.get('Authorization'))
    await validateVendorAccess(supabase, user.id)

    console.log('Fetching calculation data...')
    const calculation = await fetchCalculationData(supabase, calculationId, user.id)

    console.log('Processing report...')
    const { signedUrl } = await processReport(supabase, calculation)

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