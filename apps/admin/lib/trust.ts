import { db } from "@vocalink/db/src/client";
import { providers, providerVerifications, reports } from "@vocalink/db/src/schema/core";
import { eq, desc } from "drizzle-orm";

export async function listPendingVerifications() {
  return db.select({
    id: providerVerifications.id, status: providerVerifications.status, notes: providerVerifications.notes,
    providerId: providers.id, name: providers.name, type: providers.type, bio: providers.bio,
    state: providers.state, city: providers.city, contact: providers.contact,
    verificationStatus: providers.verificationStatus
  }).from(providerVerifications).leftJoin(providers, eq(providerVerifications.providerId, providers.id))
    .where(eq(providerVerifications.status, "pending")).limit(50);
}

export async function decideVerification(verificationId: string, decision: "approved" | "rejected" | "needs_info", reviewerNote: string) {
  const rows = await db.select().from(providerVerifications).where(eq(providerVerifications.id, verificationId)).limit(1);
  const v = rows[0];
  if (!v) throw new Error("not found");
  await db.update(providerVerifications).set({ status: decision === "approved" ? "approved" : decision === "rejected" ? "rejected" : "pending", notes: reviewerNote }).where(eq(providerVerifications.id, verificationId));
  await db.update(providers).set({ verificationStatus: decision === "approved" ? "approved" : decision === "rejected" ? "rejected" : "pending" }).where(eq(providers.id, v.providerId));
}

export async function listOpenReports() {
  return db.select().from(reports).where(eq(reports.status, "open")).orderBy(desc(reports.createdAt)).limit(50);
}
