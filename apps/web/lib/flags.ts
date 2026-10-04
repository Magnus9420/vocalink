import { db } from "@vocalink/db/src/client";
import { featureFlags } from "@vocalink/db/src/schema/core";
import { eq } from "drizzle-orm";

export async function isEnabled(key: string): Promise<boolean> {
  try {
    const rows = await db.select().from(featureFlags).where(eq(featureFlags.key, key)).limit(1);
    return rows[0]?.enabled ?? true;
  } catch {
    return true;
  }
}
