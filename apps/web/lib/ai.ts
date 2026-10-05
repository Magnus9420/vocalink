import { createHash } from "crypto";
import { appendFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { db } from "@vocalink/db/src/client";
import { aiCache } from "@vocalink/db/src/schema/marketplace";
import { featureFlags } from "@vocalink/db/src/schema/core";
import { eq } from "drizzle-orm";

const TRADES = ["Fashion", "Catering", "Welding", "Plumbing", "Carpentry", "Electrical Installation", "Photography", "Videography", "Beauty", "Construction", "Automotive"];

// Debug log a beginner can open in Notepad (no secrets: never logs the key).
async function debugLog(line: string) {
  try {
    const file = join(process.cwd(), "..", "..", "logs", "ai-debug.log");
    await mkdir(dirname(file), { recursive: true });
    await appendFile(file, `${new Date().toISOString()} ${line}\n`);
  } catch { /* never break the page */ }
}

export async function aiStatus(): Promise<{ flagOn: boolean; hasKey: boolean }> {
  let flagOn = false;
  try {
    const rows = await db.select().from(featureFlags).where(eq(featureFlags.key, "ai_recommendations")).limit(1);
    flagOn = rows[0]?.enabled ?? false;
  } catch {
    flagOn = false;
  }
  return { flagOn, hasKey: Boolean(process.env.GEMINI_API_KEY) };
}

// AI enhance for Guided Discovery. Rules result stays primary; this adds a
// short AI note. Returns null on any failure (quota, no key, flag off) —
// the journey never blocks on AI. Only anonymous answers leave this server.
export async function aiEnhance(answers: Record<string, string>, rulesTrade: string): Promise<{ text: string; cached: boolean } | null> {
  const { flagOn, hasKey } = await aiStatus();
  if (!flagOn || !hasKey) return null;
  const key = "guided:" + createHash("sha256").update(JSON.stringify([answers, rulesTrade])).digest("hex").slice(0, 32);
  try {
    const hit = await db.select().from(aiCache).where(eq(aiCache.key, key)).limit(1);
    if (hit[0]) return { text: String((hit[0].output as { text?: string })?.text ?? ""), cached: true };
  } catch {
    return null;
  }
  const prompt =
    `You advise Nigerian youths on vocational training. Answers: interests=${answers.interest}, learning=${answers.method}, budget=${answers.budget}, location=${answers.state}. ` +
    `Rules engine suggested: ${rulesTrade}. Valid trades only: ${TRADES.join(", ")}. ` +
    `Reply in 3 short bullets: (1) why the suggested trade fits, (2) one alternative trade from the list, (3) first practical step this week. Under 90 words. Plain text, no markdown.`;
  try {
    const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 220, temperature: 0.4 }
        })
      }
    );
    if (!res.ok) {
      const errBody = (await res.text()).slice(0, 300);
      console.error(`[ai] Gemini ${res.status} model=${model}: ${errBody}`);
      await debugLog(`HTTP ${res.status} model=${model} body=${errBody}`);
      return null;
    }
    const data = (await res.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
    const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("").trim() ?? "";
    if (!text) return null;
    try {
      await db.insert(aiCache).values({ key, input: { answers, rulesTrade }, output: { text } }).onConflictDoNothing();
    } catch { /* cache is best-effort */ }
    return { text, cached: false };
  } catch (e) {
    console.error(`[ai] exception: ${String(e).slice(0, 200)}`);
    await debugLog(`EXCEPTION ${String(e).slice(0, 200)}`);
    return null;
  }
}
