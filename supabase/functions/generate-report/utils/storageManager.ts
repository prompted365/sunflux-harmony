import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

export async function getSignedUrl(supabase: SupabaseClient, path: string) {
  if (!path) return null
  
  const { data: { signedUrl }, error } = await supabase
    .storage
    .from('solar_imagery')
    .createSignedUrl(path, 3600)

  if (error) {
    console.error('Error getting signed URL:', error)
    return null
  }
  
  return signedUrl
}

export async function uploadPdfToStorage(
  supabase: SupabaseClient, 
  pdfBuffer: ArrayBuffer, 
  calculationId: string
) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const fileName = `report_${calculationId}_${timestamp}.pdf`
  const filePath = `reports/${fileName}`

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

  const { data: { signedUrl }, error: urlError } = await supabase
    .storage
    .from('reports')
    .createSignedUrl(filePath, 60 * 60 * 24 * 7) // 7 days

  if (urlError) {
    console.error('Failed to generate URL:', urlError)
    throw new Error('Failed to generate report URL')
  }

  return { filePath, signedUrl }
}