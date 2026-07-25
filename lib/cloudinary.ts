import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

export const isCloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

/**
 * Uploads a file buffer directly to Cloudinary with automatic WebP optimization.
 */
export async function uploadToCloudinary(
  fileBuffer: Buffer,
  folder: string = "products"
): Promise<string> {
  if (!isCloudinaryConfigured) {
    throw new Error("Cloudinary is not fully configured in environment variables.");
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `aurelia/${folder}`,
        resource_type: "auto",
        quality: "auto",
        fetch_format: "auto",
      },
      (error, result) => {
        if (error || !result) {
          reject(new Error(`Cloudinary upload error: ${error?.message || "Unknown"}`));
        } else {
          resolve(result.secure_url);
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
}
