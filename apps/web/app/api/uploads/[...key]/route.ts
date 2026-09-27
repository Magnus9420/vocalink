import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname, normalize } from "node:path";

function baseDir() {
  return process.env.LOCAL_UPLOADS_DIR || join(process.cwd(), "..", "..", "uploads");
}

function safeKey(parts: string[]): string | null {
  const key = normalize(parts.join("/")).replace(/^(\.\.(\/|\\|$))+/, "");
  if (key.startsWith("/") || key.includes("..")) return null;
  return key;
}

export async function GET(_req: NextRequest, { params }: { params: { key: string[] } }) {
  const key = safeKey(params.key ?? []);
  if (!key) return new NextResponse("bad key", { status: 400 });
  try {
    const data = await readFile(join(baseDir(), key));
    return new NextResponse(new Uint8Array(data), { headers: { "Content-Type": "application/octet-stream" } });
  } catch {
    return new NextResponse("not found", { status: 404 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { key: string[] } }) {
  const key = safeKey(params.key ?? []);
  if (!key) return new NextResponse("bad key", { status: 400 });
  const buf = new Uint8Array(await req.arrayBuffer());
  if (buf.length > 10 * 1024 * 1024) return new NextResponse("max 10MB", { status: 413 });
  const full = join(baseDir(), key);
  await mkdir(dirname(full), { recursive: true });
  await writeFile(full, buf);
  return NextResponse.json({ ok: true, url: `/api/uploads/${key}` });
}
