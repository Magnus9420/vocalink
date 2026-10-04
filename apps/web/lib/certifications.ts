import { db } from "@vocalink/db/src/client";
import { certificationPathways, learnerCertifications, portfolios, enrolments, programmes, providers } from "@vocalink/db/src/schema/core";
import { eq, and, desc } from "drizzle-orm";
import { randomUUID } from "crypto";
import { DEMO_LEARNER } from "./learning";

export const CERT_STEPS = ["interested", "in_progress", "assessed", "certified"] as const;
export type CertStatus = (typeof CERT_STEPS)[number];

export async function listPathways() {
  return db.select().from(certificationPathways).limit(50);
}

export async function getPathway(id: string) {
  const rows = await db.select().from(certificationPathways).where(eq(certificationPathways.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function myCertStatus(pathwayId: string): Promise<CertStatus | null> {
  const rows = await db.select().from(learnerCertifications)
    .where(and(eq(learnerCertifications.learnerUserId, DEMO_LEARNER), eq(learnerCertifications.pathwayId, pathwayId))).limit(1);
  return (rows[0]?.status as CertStatus) ?? null;
}

export async function setCertStatus(pathwayId: string, status: CertStatus) {
  const rows = await db.select().from(learnerCertifications)
    .where(and(eq(learnerCertifications.learnerUserId, DEMO_LEARNER), eq(learnerCertifications.pathwayId, pathwayId))).limit(1);
  if (rows[0]) {
    await db.update(learnerCertifications).set({ status }).where(eq(learnerCertifications.id, rows[0].id));
  } else {
    await db.insert(learnerCertifications).values({ id: randomUUID(), learnerUserId: DEMO_LEARNER, pathwayId, status });
  }
}

export async function myCertifications() {
  return db.select({
    id: learnerCertifications.id, status: learnerCertifications.status,
    pathwayId: certificationPathways.id, trade: certificationPathways.trade,
    body: certificationPathways.body, isNsqRelated: certificationPathways.isNsqRelated
  }).from(learnerCertifications)
    .leftJoin(certificationPathways, eq(learnerCertifications.pathwayId, certificationPathways.id))
    .where(eq(learnerCertifications.learnerUserId, DEMO_LEARNER)).limit(50);
}

export async function myPortfolios() {
  return db.select().from(portfolios).where(eq(portfolios.learnerUserId, DEMO_LEARNER)).orderBy(desc(portfolios.createdAt)).limit(50);
}

export async function addPortfolio(input: { title: string; trade: string; description: string; mediaR2Keys: string[] }) {
  const id = randomUUID();
  await db.insert(portfolios).values({ id, learnerUserId: DEMO_LEARNER, ...input });
  return id;
}

export async function myCompletedTraining() {
  return db.select({
    title: programmes.title, tradeCategory: programmes.tradeCategory, providerName: providers.name
  }).from(enrolments)
    .leftJoin(programmes, eq(enrolments.programmeId, programmes.id))
    .leftJoin(providers, eq(programmes.providerId, providers.id))
    .where(and(eq(enrolments.learnerUserId, DEMO_LEARNER), eq(enrolments.status, "completed"))).limit(50);
}
