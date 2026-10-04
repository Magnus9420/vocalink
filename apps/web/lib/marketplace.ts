import { db } from "@vocalink/db/src/client";
import { programmes, providers, enrolments, reviews, opportunities, certificationPathways } from "@vocalink/db/src/schema/core";
import { notifications, notificationPrefs, conversations, messages } from "@vocalink/db/src/schema/marketplace";
import { eq, desc, ilike, or } from "drizzle-orm";
import { randomUUID } from "crypto";
import { DEMO_LEARNER } from "./learning";

export async function notify(userId: string, type: string, title: string, body?: string) {
  await db.insert(notifications).values({ id: randomUUID(), userId, type, title, body: body ?? "" });
}

export async function myNotifications() {
  return db.select().from(notifications).where(eq(notifications.userId, DEMO_LEARNER)).orderBy(desc(notifications.createdAt)).limit(50);
}

export async function markAllRead() {
  await db.update(notifications).set({ read: true }).where(eq(notifications.userId, DEMO_LEARNER));
}

export async function getPrefs(): Promise<string[]> {
  const rows = await db.select().from(notificationPrefs).where(eq(notificationPrefs.userId, DEMO_LEARNER)).limit(1);
  return (rows[0]?.categories as string[]) ?? ["training", "certification", "work", "messages"];
}

export async function savePrefs(categories: string[]) {
  const rows = await db.select().from(notificationPrefs).where(eq(notificationPrefs.userId, DEMO_LEARNER)).limit(1);
  if (rows[0]) await db.update(notificationPrefs).set({ categories }).where(eq(notificationPrefs.userId, DEMO_LEARNER));
  else await db.insert(notificationPrefs).values({ userId: DEMO_LEARNER, categories });
}

export async function providerStats() {
  const provs = await db.select().from(providers).limit(50);
  const progs = await db.select().from(programmes).limit(200);
  const enrs = await db.select().from(enrolments).limit(500);
  const revs = await db.select().from(reviews).limit(500);
  return provs.map((p) => {
    const mine = progs.filter((g) => g.providerId === p.id);
    const ids = new Set(mine.map((g) => g.id));
    const e = enrs.filter((x) => ids.has(x.programmeId ?? ""));
    const r = revs.filter((x) => ids.has(x.programmeId ?? ""));
    const avg = r.length ? (r.reduce((s, x) => s + (x.rating ?? 0), 0) / r.length).toFixed(1) : "—";
    return { ...p, programmeCount: mine.length, enrolmentCount: e.length, reviewCount: r.length, avg };
  });
}

export async function publishSponsored(input: { providerId: string; title: string; tradeCategory: string; description: string; state: string; city: string; sponsor: string; eligibility: string; beneficiaryTarget: string; spaces: number }) {
  const id = `programme-${randomUUID().slice(0, 8)}`;
  await db.insert(programmes).values({
    id, status: "published", format: "offline", duration: "6 weeks",
    costType: "sponsored", certificationInfo: "Completion certificate", ...input
  });
  return id;
}

export async function globalSearch(q: string) {
  const like = `%${q}%`;
  const [progs, provs, opps, paths] = await Promise.all([
    db.select({ id: programmes.id, title: programmes.title }).from(programmes).where(or(ilike(programmes.title, like), ilike(programmes.description, like))!).limit(10),
    db.select({ id: providers.id, name: providers.name }).from(providers).where(ilike(providers.name, like)).limit(10),
    db.select({ id: opportunities.id, role: opportunities.role }).from(opportunities).where(ilike(opportunities.role, like)).limit(10),
    db.select({ id: certificationPathways.id, trade: certificationPathways.trade }).from(certificationPathways).where(ilike(certificationPathways.trade, like)).limit(10)
  ]);
  return { programmes: progs, providers: provs, opportunities: opps, pathways: paths };
}

export async function listConversations() {
  return db.select().from(conversations).orderBy(desc(conversations.createdAt)).limit(30);
}

export async function getThread(id: string) {
  const conv = (await db.select().from(conversations).where(eq(conversations.id, id)).limit(1))[0] ?? null;
  const msgs = await db.select().from(messages).where(eq(messages.conversationId, id)).orderBy(messages.createdAt).limit(100);
  return { conv, msgs };
}

export async function startConversation(subject: string, body: string) {
  const id = randomUUID();
  await db.insert(conversations).values({ id, subject });
  await db.insert(messages).values({ id: randomUUID(), conversationId: id, senderId: DEMO_LEARNER, body });
  await notify(DEMO_LEARNER, "messages", "Message sent", subject);
  return id;
}

export async function reply(conversationId: string, body: string) {
  await db.insert(messages).values({ id: randomUUID(), conversationId, senderId: DEMO_LEARNER, body });
}
