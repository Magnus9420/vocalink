import { db } from "@vocalink/db/src/client";
import { programmes, providers } from "@vocalink/db/src/schema/core";
import { and, eq, ilike, or, sql } from "drizzle-orm";

export type DiscoverFilters = {
  q?: string;
  trade?: string;
  state?: string;
  costType?: "free" | "sponsored" | "paid";
  format?: "online" | "offline" | "hybrid";
  verifiedOnly?: boolean;
  certifiedOnly?: boolean;
};

export async function searchProgrammes(f: DiscoverFilters) {
  const conds = [eq(programmes.status, "published")];
  if (f.trade) conds.push(eq(programmes.tradeCategory, f.trade));
  if (f.state) conds.push(eq(programmes.state, f.state));
  if (f.costType) conds.push(eq(programmes.costType, f.costType));
  if (f.format) conds.push(eq(programmes.format, f.format));
  if (f.verifiedOnly) conds.push(eq(providers.verificationStatus, "approved"));
  if (f.certifiedOnly) conds.push(sql`${programmes.certificationInfo} IS NOT NULL AND ${programmes.certificationInfo} <> ''`);
  if (f.q) {
    const q = `%${f.q}%`;
    conds.push(or(ilike(programmes.title, q), ilike(programmes.description, q), ilike(programmes.tradeCategory, q))!);
  }
  const rows = await db
    .select({
      id: programmes.id,
      title: programmes.title,
      tradeCategory: programmes.tradeCategory,
      description: programmes.description,
      state: programmes.state,
      city: programmes.city,
      format: programmes.format,
      duration: programmes.duration,
      costType: programmes.costType,
      certificationInfo: programmes.certificationInfo,
      spaces: programmes.spaces,
      providerName: providers.name,
      verificationStatus: providers.verificationStatus
    })
    .from(programmes)
    .leftJoin(providers, eq(programmes.providerId, providers.id))
    .where(and(...conds))
    .limit(50);
  // Verified first, then newest-ish (stable order by title for Phase 1)
  return rows.sort((a, b) => Number(b.verificationStatus === "approved") - Number(a.verificationStatus === "approved"));
}

export async function getProgramme(id: string) {
  const rows = await db
    .select({
      id: programmes.id,
      title: programmes.title,
      tradeCategory: programmes.tradeCategory,
      description: programmes.description,
      state: programmes.state,
      city: programmes.city,
      format: programmes.format,
      duration: programmes.duration,
      costType: programmes.costType,
      certificationInfo: programmes.certificationInfo,
      entryRequirements: programmes.entryRequirements,
      spaces: programmes.spaces,
      providerName: providers.name,
      providerBio: providers.bio,
      verificationStatus: providers.verificationStatus,
      contact: providers.contact
    })
    .from(programmes)
    .leftJoin(providers, eq(programmes.providerId, providers.id))
    .where(eq(programmes.id, id))
    .limit(1);
  return rows[0] ?? null;
}
