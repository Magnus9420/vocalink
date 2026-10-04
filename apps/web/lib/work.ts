import { db } from "@vocalink/db/src/client";
import { opportunities, applications, learnerProfiles, learnerCertifications, certificationPathways, portfolios } from "@vocalink/db/src/schema/core";
import { notifications } from "@vocalink/db/src/schema/marketplace";
import { eq, and, ilike, or, desc } from "drizzle-orm";
import { randomUUID } from "crypto";
import { DEMO_LEARNER } from "./learning";

export const DEMO_ORG = "anonymous-org";

export type WorkFilters = { q?: string; type?: string; trade?: string; state?: string; paid?: string };

export async function listOpportunities(f: WorkFilters) {
  const conds = [eq(opportunities.status, "open")];
  if (f.type) conds.push(eq(opportunities.type, f.type));
  if (f.trade) conds.push(eq(opportunities.trade, f.trade));
  if (f.state) conds.push(eq(opportunities.state, f.state));
  if (f.paid) conds.push(eq(opportunities.paidStatus, f.paid));
  if (f.q) {
    const q = `%${f.q}%`;
    conds.push(or(ilike(opportunities.role, q), ilike(opportunities.trade, q), ilike(opportunities.requirements, q))!);
  }
  return db.select().from(opportunities).where(and(...conds)).orderBy(desc(opportunities.createdAt)).limit(50);
}

export async function getOpportunity(id: string) {
  const rows = await db.select().from(opportunities).where(eq(opportunities.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function postOpportunity(input: { type: string; role: string; trade: string; state: string; city: string; paidStatus: string; requirements: string }) {
  const id = `opp-${randomUUID().slice(0, 8)}`;
  await db.insert(opportunities).values({ id, orgUserId: DEMO_ORG, status: "open", ...input });
  return id;
}

export async function apply(opportunityId: string) {
  const existing = await db.select().from(applications)
    .where(and(eq(applications.learnerUserId, DEMO_LEARNER), eq(applications.opportunityId, opportunityId))).limit(1);
  if (existing[0]) return existing[0].id;
  const id = randomUUID();
  await db.insert(applications).values({ id, learnerUserId: DEMO_LEARNER, opportunityId, status: "applied" });
  await db.insert(notifications).values({ id: randomUUID(), userId: DEMO_LEARNER, type: "work", title: "Application sent", body: opportunityId });
  return id;
}

export async function myApplications() {
  return db.select({
    id: applications.id, status: applications.status,
    opportunityId: opportunities.id, role: opportunities.role, type: opportunities.type,
    trade: opportunities.trade, state: opportunities.state, paidStatus: opportunities.paidStatus
  }).from(applications)
    .leftJoin(opportunities, eq(applications.opportunityId, opportunities.id))
    .where(eq(applications.learnerUserId, DEMO_LEARNER)).orderBy(desc(applications.createdAt)).limit(50);
}

export async function applicantsFor(opportunityId: string) {
  return db.select({ id: applications.id, status: applications.status, learnerUserId: applications.learnerUserId })
    .from(applications).where(eq(applications.opportunityId, opportunityId)).limit(50);
}

// Employer candidate search: by trade interest/state + certified trade (local-demo, simplified)
export async function searchCandidates(f: { trade?: string; state?: string; certified?: boolean }) {
  const profs = await db.select().from(learnerProfiles).limit(50);
  void f;
  const certs = await db.select({
    learnerUserId: learnerCertifications.learnerUserId, trade: certificationPathways.trade, status: learnerCertifications.status
  }).from(learnerCertifications).leftJoin(certificationPathways, eq(learnerCertifications.pathwayId, certificationPathways.id)).limit(100);
  const ports = await db.select().from(portfolios).limit(100);
  return { profiles: profs, certifications: certs, portfolios: ports };
}
