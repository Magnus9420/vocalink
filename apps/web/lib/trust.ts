import { db } from "@vocalink/db/src/client";
import { providers, providerVerifications, reviews, reports, programmes } from "@vocalink/db/src/schema/core";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function submitProvider(input: { name: string; type: string; bio: string; state: string; city: string; contact: string; evidence: string }) {
  const id = `provider-${randomUUID().slice(0, 8)}`;
  await db.insert(providers).values({
    id, name: input.name, type: input.type, bio: input.bio,
    state: input.state, city: input.city, contact: input.contact, verificationStatus: "pending"
  });
  await db.insert(providerVerifications).values({
    id: randomUUID(), providerId: id, evidenceR2Keys: input.evidence ? [input.evidence] : [], status: "pending", notes: "Awaiting review"
  });
  return id;
}

export async function listPendingVerifications() {
  return db.select({
    id: providerVerifications.id, status: providerVerifications.status, notes: providerVerifications.notes,
    providerId: providers.id, name: providers.name, type: providers.type, bio: providers.bio,
    state: providers.state, city: providers.city, contact: providers.contact,
    verificationStatus: providers.verificationStatus
  }).from(providerVerifications).leftJoin(providers, eq(providerVerifications.providerId, providers.id))
    .where(eq(providerVerifications.status, "pending")).orderBy(desc(providers.name)).limit(50);
}

export async function decideVerification(verificationId: string, decision: "approved" | "rejected" | "needs_info", reviewerNote: string) {
  const rows = await db.select().from(providerVerifications).where(eq(providerVerifications.id, verificationId)).limit(1);
  const v = rows[0];
  if (!v) throw new Error("not found");
  await db.update(providerVerifications).set({ status: decision === "approved" ? "approved" : decision === "rejected" ? "rejected" : "pending", notes: reviewerNote }).where(eq(providerVerifications.id, verificationId));
  await db.update(providers).set({ verificationStatus: decision === "approved" ? "approved" : decision === "rejected" ? "rejected" : "pending" }).where(eq(providers.id, v.providerId));
}

export async function publishProgramme(input: { providerId: string; title: string; tradeCategory: string; description: string; state: string; city: string; format: "online" | "offline" | "hybrid"; duration: string; costType: "free" | "sponsored" | "paid"; certificationInfo: string; entryRequirements: string; spaces: number }) {
  const id = `programme-${randomUUID().slice(0, 8)}`;
  await db.insert(programmes).values({ id, status: "published", ...input });
  return id;
}

export async function listProviders() {
  return db.select().from(providers).limit(100);
}

export async function submitReview(programmeId: string, rating: number, body: string) {
  await db.insert(reviews).values({ id: randomUUID(), learnerUserId: "anonymous-learner", programmeId, rating, body, moderationStatus: "approved" });
}

export async function listReviews(programmeId: string) {
  return db.select().from(reviews).where(eq(reviews.programmeId, programmeId)).orderBy(desc(reviews.createdAt)).limit(20);
}

export async function submitReport(targetType: string, targetId: string, reason: string) {
  await db.insert(reports).values({ id: randomUUID(), reporterUserId: "anonymous-learner", targetType, targetId, reason, status: "open" });
}

export async function listOpenReports() {
  return db.select().from(reports).where(eq(reports.status, "open")).orderBy(desc(reports.createdAt)).limit(50);
}
