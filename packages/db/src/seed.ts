import { db } from "./client";
import { featureFlags, certificationPathways, providers, programmes, opportunities } from "./schema/core";
import { trades } from "./schema/discover";
import { randomUUID } from "crypto";

const TRADES = [
  "Fashion", "Catering", "Welding", "Plumbing", "Carpentry",
  "Electrical Installation", "Photography", "Videography",
  "Beauty", "Construction", "Automotive"
];

async function main() {
  for (const name of TRADES) {
    await db
      .insert(trades)
      .values({ id: `trade-${name.toLowerCase().replace(/[^a-z]+/g, "-")}`, name, category: "Vocational", active: true })
      .onConflictDoNothing();
  }
  console.log("Seeded trades:", TRADES.length);

  const flags = ["guided_discovery", "reviews", "jobs", "internships", "provider_reg", "employer_reg"];
  for (const key of flags) {
    await db.insert(featureFlags).values({ key, enabled: true }).onConflictDoNothing();
  }

  await db
    .insert(certificationPathways)
    .values({
      id: "cert-electrical-nsq",
      trade: "Electrical Installation",
      body: "NSQ-related body (placeholder)",
      steps: ["Complete training", "Book assessment", "Pass assessment", "Get certified"],
      assessmentLocation: "Approved centre — Lagos (placeholder)",
      requirements: "Training completion + ID",
      isNsqRelated: true
    })
    .onConflictDoNothing();

  const extraPathways = [
    { id: "cert-fashion", trade: "Fashion", body: "Garment making association (placeholder)", steps: ["Complete training", "Submit portfolio", "Pass assessment", "Get certified"], assessmentLocation: "Abuja centre (placeholder)", requirements: "Training completion + portfolio", isNsqRelated: false },
    { id: "cert-plumbing", trade: "Plumbing", body: "NSQ-related body (placeholder)", steps: ["Complete training", "Book assessment", "Pass assessment", "Get certified"], assessmentLocation: "Lagos centre (placeholder)", requirements: "Training completion + ID", isNsqRelated: true },
    { id: "cert-photo", trade: "Photography", body: "Creative industry body (placeholder)", steps: ["Complete training", "Submit portfolio", "Get certified"], assessmentLocation: "Online review (placeholder)", requirements: "Portfolio of 10 works", isNsqRelated: false }
  ];
  for (const p of extraPathways) {
    await db.insert(certificationPathways).values(p).onConflictDoNothing();
  }

  await db
    .insert(providers)
    .values({
      id: "provider-brightvolt",
      name: "BrightVolt Academy",
      type: "Vocational centre",
      bio: "Practical electrical training in Lagos.",
      state: "Lagos",
      city: "Ikeja",
      verificationStatus: "approved",
      contact: "hello@brightvolt.example"
    })
    .onConflictDoNothing();

  await db
    .insert(providers)
    .values({
      id: "provider-stitchlab",
      name: "StitchLab Fashion Studio",
      type: "Private training org",
      bio: "Fashion design for beginners in Abuja.",
      state: "FCT",
      city: "Abuja",
      verificationStatus: "pending",
      contact: "hello@stitchlab.example"
    })
    .onConflictDoNothing();

  const demos = [
    { id: "programme-elec-beginner", providerId: "provider-brightvolt", title: "Electrical Installation — Beginner", tradeCategory: "Electrical Installation", description: "Wiring, safety, fittings. 3 months offline in Ikeja with NSQ pathway.", state: "Lagos", city: "Ikeja", format: "offline" as const, duration: "3 months", costType: "free" as const, certificationInfo: "NSQ pathway available", spaces: 30, status: "published" },
    { id: "programme-elec-advanced", providerId: "provider-brightvolt", title: "Electrical Installation — Advanced", tradeCategory: "Electrical Installation", description: "Industrial wiring and troubleshooting. Paid weekend cohort.", state: "Lagos", city: "Ikeja", format: "offline" as const, duration: "2 months", costType: "paid" as const, certificationInfo: "NSQ pathway available", spaces: 20, status: "published" },
    { id: "programme-fashion-start", providerId: "provider-stitchlab", title: "Fashion Design Starter", tradeCategory: "Fashion", description: "Pattern drafting, sewing, finishing. Beginner friendly.", state: "FCT", city: "Abuja", format: "offline" as const, duration: "6 weeks", costType: "sponsored" as const, certificationInfo: "Completion certificate", spaces: 25, status: "published" },
    { id: "programme-photo-online", providerId: "provider-stitchlab", title: "Photography Basics (Online)", tradeCategory: "Photography", description: "Camera basics, lighting, editing. Fully online.", state: "Lagos", city: "Lekki", format: "online" as const, duration: "4 weeks", costType: "free" as const, certificationInfo: "Completion certificate", spaces: 100, status: "published" },
    { id: "programme-plumbing", providerId: "provider-brightvolt", title: "Plumbing Essentials", tradeCategory: "Plumbing", description: "Pipework, fittings, repairs. Practical weekends.", state: "Lagos", city: "Surulere", format: "hybrid" as const, duration: "8 weeks", costType: "paid" as const, certificationInfo: "NSQ pathway (planned)", spaces: 15, status: "published" },
    { id: "programme-catering", providerId: "provider-stitchlab", title: "Catering & Small Chops", tradeCategory: "Catering", description: "Nigerian catering, costing, hygiene. Sponsored seats.", state: "FCT", city: "Abuja", format: "offline" as const, duration: "5 weeks", costType: "sponsored" as const, certificationInfo: "Completion certificate", spaces: 40, status: "published" }
  ];

  for (const p of demos) {
    await db.insert(programmes).values(p).onConflictDoNothing();
  }
  console.log("Seeded demo providers + programmes:", demos.length);

  const opps = [
    { id: "opp-elec-intern", orgUserId: "anonymous-org", type: "internship", role: "Electrical Intern — Ikeja", trade: "Electrical Installation", state: "Lagos", city: "Ikeja", paidStatus: "stipend", requirements: "Completed beginner training. 3 months, site visits.", status: "open" },
    { id: "opp-fashion-job", orgUserId: "anonymous-org", type: "job", role: "Junior Fashion Designer", trade: "Fashion", state: "FCT", city: "Abuja", paidStatus: "paid", requirements: "Portfolio of 3 pieces. Full-time.", status: "open" },
    { id: "opp-photo-mentor", orgUserId: "anonymous-org", type: "mentorship", role: "Photography Mentorship", trade: "Photography", state: "Lagos", city: "Lekki", paidStatus: "unpaid", requirements: "Beginners with camera. 6 weeks.", status: "open" },
    { id: "opp-plumbing-job", orgUserId: "anonymous-org", type: "job", role: "Plumber — Maintenance", trade: "Plumbing", state: "Lagos", city: "Surulere", paidStatus: "paid", requirements: "Practical experience. References.", status: "open" },
    { id: "opp-catering-appren", orgUserId: "anonymous-org", type: "apprenticeship", role: "Catering Apprentice", trade: "Catering", state: "FCT", city: "Abuja", paidStatus: "stipend", requirements: "5 weeks training complete. Weekend events.", status: "open" }
  ];
  for (const o of opps) {
    await db.insert(opportunities).values(o).onConflictDoNothing();
  }
  console.log("Seeded demo opportunities:", opps.length);
  console.log("Seed done. Next: pnpm dev (web :3000)");
  process.exit(0);
}

void randomUUID;

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
