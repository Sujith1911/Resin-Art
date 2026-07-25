import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "products";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. Primary: If Cloudinary keys are set, upload to Cloudinary (Free 25 GB/month + Auto WebP compression!)
    if (isCloudinaryConfigured) {
      const cloudinaryUrl = await uploadToCloudinary(buffer, folder);
      return NextResponse.json({ url: cloudinaryUrl, provider: "cloudinary" });
    }

    // 2. Fallback: Supabase Storage if Cloudinary keys aren't set yet during initial test
    const supabase = await createServerSupabaseClient();
    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { data, error } = await supabase.storage
      .from("assets")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      return NextResponse.json({ error: `Supabase Upload Error: ${error.message}` }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from("assets").getPublicUrl(data.path);
    return NextResponse.json({ url: urlData.publicUrl, provider: "supabase-storage" });

  } catch (err: any) {
    console.error("Upload handler error:", err);
    return NextResponse.json({ error: err.message || "Failed to upload file" }, { status: 500 });
  }
}
