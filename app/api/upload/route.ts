import { NextRequest, NextResponse } from "next/server";
import { uploadToR2, isR2Configured } from "@/lib/r2";
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

    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    // 1. If Cloudflare R2 is configured, upload to R2 ($0 egress fees!)
    if (isR2Configured) {
      const r2Url = await uploadToR2(buffer, fileName, file.type);
      return NextResponse.json({ url: r2Url, provider: "cloudflare-r2" });
    }

    // 2. Fallback to Supabase Storage if R2 keys are not present yet
    const supabase = await createServerSupabaseClient();
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
