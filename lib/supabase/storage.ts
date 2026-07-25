import { createClient } from "@/lib/supabase/client";

const BUCKET = "assets";

/**
 * Upload an image file to Supabase Storage and return the public URL.
 * @param file - The File object from <input type="file">
 * @param folder - Subfolder inside the bucket (e.g., "products", "banners")
 * @returns Public URL string
 */
export async function uploadImage(file: File, folder: string = "products"): Promise<string> {
  const supabase = createClient();

  // Generate unique filename
  const ext = file.name.split(".").pop() || "jpg";
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  // Get public URL
  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
  return urlData.publicUrl;
}

/**
 * Delete an image from Supabase Storage by its public URL.
 */
export async function deleteImage(publicUrl: string): Promise<void> {
  const supabase = createClient();

  // Extract path from public URL
  const urlParts = publicUrl.split(`/storage/v1/object/public/${BUCKET}/`);
  if (urlParts.length < 2) return;

  const path = urlParts[1];
  await supabase.storage.from(BUCKET).remove([path]);
}
