import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { jsPDF } from 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm'
import { generateReport } from './reportGenerator.ts'
import { getSignedUrl, uploadPdfToStorage } from './storageManager.ts'

export async function processReport(supabase: SupabaseClient, calculation: any) {
  // Transform building specs to include signed URLs
  const buildingSpecs = calculation.building_specs || {}
  if (buildingSpecs.imagery) {
    buildingSpecs.imagery = {
      ...buildingSpecs.imagery,
      rgb: await getSignedUrl(supabase, buildingSpecs.imagery.rgb),
      mask: await getSignedUrl(supabase, buildingSpecs.imagery.mask),
      dsm: await getSignedUrl(supabase, buildingSpecs.imagery.dsm)
    }
  }

  const propertyAddress = `${calculation.properties.address}, ${calculation.properties.city}, ${calculation.properties.state} ${calculation.properties.zip_code}`
  
  console.log('Generating HTML report')
  const htmlContent = generateReport({
    ...calculation,
    buildingSpecs,
    propertyAddress
  })

  // Convert to PDF
  console.log('Converting to PDF')
  const doc = new jsPDF()
  
  return new Promise((resolve, reject) => {
    doc.html(htmlContent, {
      callback: async function (doc) {
        try {
          const pdfBuffer = doc.output('arraybuffer')
          const { filePath, signedUrl } = await uploadPdfToStorage(supabase, pdfBuffer, calculation.id)

          // Save report reference
          console.log('Saving report reference')
          const { error: reportError } = await supabase
            .from('reports')
            .insert({
              calculation_id: calculation.id,
              file_path: filePath
            })

          if (reportError) {
            console.error('Failed to save report reference:', reportError)
            throw new Error('Failed to save report reference')
          }

          resolve({ signedUrl })
        } catch (error) {
          reject(error)
        }
      },
      x: 10,
      y: 10
    })
  })
}