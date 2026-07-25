import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME || "aurelia-assets";
const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

export const isR2Configured = Boolean(accountId && accessKeyId && secretAccessKey);

// Initialize S3 Client targeting Cloudflare R2 Endpoint
const r2Client = isR2Configured
  ? new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: accessKeyId!,
        secretAccessKey: secretAccessKey!,
      },
    })
  : null;

/**
 * Uploads a file buffer directly to Cloudflare R2 bucket.
 */
export async function uploadToR2(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  if (!r2Client || !isR2Configured) {
    throw new Error("Cloudflare R2 is not fully configured in environment variables.");
  }

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    Body: fileBuffer,
    ContentType: contentType,
  });

  await r2Client.send(command);

  // Return public URL (using custom public R2 domain or fallback R2 dev URL)
  if (publicUrl) {
    const baseUrl = publicUrl.endsWith("/") ? publicUrl.slice(0, -1) : publicUrl;
    return `${baseUrl}/${fileName}`;
  }

  return `https://${bucketName}.${accountId}.r2.dev/${fileName}`;
}

/**
 * Deletes an object from Cloudflare R2 bucket.
 */
export async function deleteFromR2(fileName: string): Promise<void> {
  if (!r2Client || !isR2Configured) return;

  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: fileName,
  });

  await r2Client.send(command);
}
