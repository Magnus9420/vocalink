import { db } from "@vocalink/db/src/client";
import { user } from "@vocalink/db/src/schema/auth";
import { programmes, providers, enrolments, reviews, reports, opportunities, applications, certificationPathways, learnerCertifications } from "@vocalink/db/src/schema/core";
import { featureFlags } from "@vocalink/db/src/schema/core";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function metrics() {
  const [users, provs, progs, enrs, revs, reps, opps, apps, certs, lc] = await Promise.all([
    db.select().from(user).limit(1000),
    db.select().from(providers).limit(1000),
    db.select().from(programmes).limit(1000),
    db.select().from(enrolments).limit(2000),
    db.select().from(reviews).limit(2000),
    db.select().from(reports).limit(500),
    db.select().from(opportunities).limit(1000),
    db.select().from(applications).limit(2000),
    db.select().from(certificationPathways).limit(100),
    db.select().from(learnerCertifications).limit(2000)
  ]);
  return {
    learners: users.filter((u) => u.role === "learner").length,
    users: users.length,
    providers: provs.length,
    verifiedProviders: provs.filter((p) => p.verificationStatus === "approved").length,
    programmes: progs.length,
    enrolments: enrs.length,
    completed: enrs.filter((e) => e.status === "completed").length,
    certPathways: certs.length,
    certTracked: lc.length,
    certified: lc.filter((c) => c.status === "certified").length,
    opportunities: opps.length,
    jobs: opps.filter((o) => o.type === "job").length,
    internships: opps.filter((o) => o.type === "internship").length,
    applications: apps.length,
    openReports: reps.filter((r) => r.status === "open").length,
    reviews: revs.length
  };
}

export async function listUsers() {
  return db.select().from(user).orderBy(desc(user.createdAt)).limit(100);
}

export async function listContent() {
  const [progs, opps] = await Promise.all([
    db.select().from(programmes).orderBy(desc(programmes.createdAt)).limit(100),
    db.select().from(opportunities).orderBy(desc(opportunities.createdAt)).limit(100)
  ]);
  return { programmes: progs, opportunities: opps };
}

export async function setProgrammeStatus(id: string, status: string) {
  await db.update(programmes).set({ status }).where(eq(programmes.id, id));
}

export async function setOpportunityStatus(id: string, status: string) {
  await db.update(opportunities).set({ status }).where(eq(opportunities.id, id));
}

export async function listAllReports() {
  return db.select().from(reports).orderBy(desc(reports.createdAt)).limit(100);
}

export async function resolveReport(id: string, status: string) {
  await db.update(reports).set({ status }).where(eq(reports.id, id));
}

export async function getFlags() {
  return db.select().from(featureFlags).limit(20);
}

export async function setFlag(key: string, enabled: boolean) {
  await db.update(featureFlags).set({ enabled }).where(eq(featureFlags.key, key));
}

export async function isEnabled(key: string): Promise<boolean> {
  const rows = await db.select().from(featureFlags).where(eq(featureFlags.key, key)).limit(1);
  return rows[0]?.enabled ?? true;
}

export async function addPathway(input: { trade: string; body: string; assessmentLocation: string; requirements: string; isNsqRelated: boolean }) {
  const id = `cert-${randomUUID().slice(0, 8)}`;
  await db.insert(certificationPathways).values({
    id, ...input, steps: ["Complete training", "Book assessment", "Pass assessment", "Get certified"]
  });
  return id;
}
