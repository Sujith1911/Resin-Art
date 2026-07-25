/**
 * Central image upload function used across Admin Products & Admin Banners.
 * Sends the file to /api/upload which routes to Cloudflare R2 (0 egress fees)
 * or Supabase Storage as fallback.
 */
export async function uploadImage(file: File, folder: string = "products"): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok || data.error) {
    throw new Error(data.error || "Image upload failed");
  }

  return data.url as string;
}

/**
 * Delete image placeholder function.
 */
export async function deleteImage(publicUrl: string): Promise<void> {
  // Cloudflare R2 & Supabase handles storage lifecycle
}
