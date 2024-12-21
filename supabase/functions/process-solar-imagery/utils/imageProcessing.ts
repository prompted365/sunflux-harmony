import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { processAndStoreImage } from '../../calculate-solar/utils/imageProcessing/index.ts'

export async function processAndStoreImagery(
  dataLayer: any,
  calculationId: string,
  supabaseClient: any,
  apiKey: string
): Promise<any> {
  console.log('Processing imagery for data layer:', dataLayer.id)

  try {
    // Process each image type in parallel
    const [dsmResult, rgbResult, maskResult] = await Promise.all([
      processAndStoreImage(dataLayer.dsm_url, 'dsm', calculationId),
      processAndStoreImage(dataLayer.rgb_url, 'rgb', calculationId),
      processAndStoreImage(dataLayer.mask_url, 'mask', calculationId)
    ]);

    console.log('Successfully processed all imagery')

    return {
      dsm: dsmResult,
      rgb: rgbResult,
      mask: maskResult,
      annualFlux: dataLayer.annual_flux_url,
      monthlyFlux: dataLayer.monthly_flux_url
    }
  } catch (error) {
    console.error('Error processing imagery:', error)
    throw new Error(`Error processing imagery: ${error.message}`)
  }
}