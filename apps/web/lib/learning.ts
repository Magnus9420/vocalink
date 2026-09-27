import { db } from "@vocalink/db/src/client";
import { enrolments, programmes, providers } from "@vocalink/db/src/schema/core";
import { eq, and, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

// Local-demo learner (no sign-in per scope). Real userId wiring comes with auth UI later.
export const DEMO_LEARNER = "anonymous-learner";

export async function enrol(programmeId: string) {
  const existing = await db.select().from(enrolments)
    .where(and(eq(enrolments.learnerUserId, DEMO_LEARNER), eq(enrolments.programmeId, programmeId))).limit(1);
  if (existing[0]) return existing[0].id;
  const id = randomUUID();
  await db.insert(enrolments).values({ id, learnerUserId: DEMO_LEARNER, programmeId, status: "enrolled", progress: 0 });
  return id;
}

export async function myEnrolments() {
  return db.select({
    id: enrolments.id, status: enrolments.status, progress: enrolments.progress,
    programmeId: programmes.id, title: programmes.title, tradeCategory: programmes.tradeCategory,
    duration: programmes.duration, costType: programmes.costType,
    certificationInfo: programmes.certificationInfo,
    providerName: providers.name, verificationStatus: providers.verificationStatus
  }).from(enrolments)
    .leftJoin(programmes, eq(enrolments.programmeId, programmes.id))
    .leftJoin(providers, eq(programmes.providerId, providers.id))
    .where(eq(enrolments.learnerUserId, DEMO_LEARNER)).orderBy(desc(enrolments.createdAt)).limit(50);
}

export async function updateProgress(enrolmentId: string, progress: number) {
  const pct = Math.max(0, Math.min(100, progress));
  await db.update(enrolments).set({ progress: pct, status: pct >= 100 ? "completed" : "enrolled" })
    .where(eq(enrolments.id, enrolmentId));
}
