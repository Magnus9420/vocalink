import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function r2Client() {
  const accountId = process.env.R2_ACCOUNT_ID!;
  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!
    }
  });
}

export async function presignedPut(bucket: string, key: string, contentType: string) {
  const url = await getSignedUrl(
    r2Client(),
    new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType }),
    { expiresIn: 600 }
  );
  return url;
}

export async function presignedGet(bucket: string, key: string) {
  const url = await getSignedUrl(r2Client(), new GetObjectCommand({ Bucket: bucket, Key: key }), {
    expiresIn: 900
  });
  return url;
}

export function publicBucket() {
  return process.env.R2_PUBLIC_BUCKET ?? "vocalink-portfolios";
}

export function privateBucket() {
  return process.env.R2_PRIVATE_BUCKET ?? "vocalink-private";
}
