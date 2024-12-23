export async function uploadToStorage(
  supabase: any,
  bucket: string,
  filePath: string,
  data: Uint8Array,
  contentType: string = 'image/png'
) {
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, data, {
      contentType,
      upsert: true
    });

  if (uploadError) {
    console.error(`Error uploading to ${bucket}/${filePath}:`, uploadError);
    throw uploadError;
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function checkFileExists(
  supabase: any,
  bucket: string,
  filePath: string
): Promise<boolean> {
  const { data: existingFile } = await supabase.storage
    .from(bucket)
    .list('', {
      search: filePath
    });

  return existingFile && existingFile.length > 0;
}