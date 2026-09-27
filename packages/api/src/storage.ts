// Free-first storage: uses Cloudflare R2 when keys exist, else local ./uploads/.
// Upgrade path: add R2_* env vars later — no code changes needed elsewhere.
import { mkdir, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { presignedPut as r2Put, presignedGet as r2Get, publicBucket, privateBucket } from "./r2";

export function useR2(): boolean {
  return Boolean(process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY);
}

export function localDir(): string {
  return process.env.LOCAL_UPLOADS_DIR ?? join(process.cwd(), "..", "..", "uploads");
}

export async function getUploadUrl(bucket: string, key: string, contentType: string): Promise<{ url: string; mode: "r2" | "local" }> {
  if (useR2()) return { url: await r2Put(bucket, key, contentType), mode: "r2" };
  return { url: `/api/uploads/${key}?mode=local`, mode: "local" };
}

export async function getFileUrl(bucket: string, key: string): Promise<{ url: string; mode: "r2" | "local" }> {
  if (useR2()) return { url: await r2Get(bucket, key), mode: "r2" };
  return { url: `/api/uploads/${key}`, mode: "local" };
}

export async function saveLocal(key: string, bytes: Uint8Array, contentType: string): Promise<string> {
  const dir = localDir();
  const full = join(dir, key);
  await mkdir(dirname(full), { recursive: true });
  await writeFile(full, bytes);
  return `/api/uploads/${key}`;
}

export { publicBucket, privateBucket };
