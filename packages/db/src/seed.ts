import { db } from "./client";
import { featureFlags, certificationPathways, providers, programmes, opportunities } from "./schema/core";
import { user } from "./schema/auth";
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

  const flags = ["guided_discovery", "reviews", "jobs", "internships", "provider_reg", "employer_reg", "ai_recommendations"];
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

  await db
    .insert(providers)
    .values({
      id: "provider-kano-tech",
      name: "Kano Technical Works",
      type: "Technical college",
      bio: "Welding, automotive and construction skills in Kano.",
      state: "Kano",
      city: "Kano",
      verificationStatus: "approved",
      contact: "hello@kanotech.example"
    })
    .onConflictDoNothing();

  await db
    .insert(providers)
    .values({
      id: "provider-rivers-beauty",
      name: "Rivers Beauty Academy",
      type: "Vocational centre",
      bio: "Beauty and hairdressing in Port Harcourt.",
      state: "Rivers",
      city: "Port Harcourt",
      verificationStatus: "pending",
      contact: "hello@riversbeauty.example"
    })
    .onConflictDoNothing();

  const demos = [
    { id: "programme-elec-beginner", providerId: "provider-brightvolt", title: "Electrical Installation — Beginner", tradeCategory: "Electrical Installation", description: "Wiring, safety, fittings. 3 months offline in Ikeja with NSQ pathway.", state: "Lagos", city: "Ikeja", format: "offline" as const, duration: "3 months", costType: "free" as const, certificationInfo: "NSQ pathway available", spaces: 30, status: "published" },
    { id: "programme-elec-advanced", providerId: "provider-brightvolt", title: "Electrical Installation — Advanced", tradeCategory: "Electrical Installation", description: "Industrial wiring and troubleshooting. Paid weekend cohort.", state: "Lagos", city: "Ikeja", format: "offline" as const, duration: "2 months", costType: "paid" as const, certificationInfo: "NSQ pathway available", spaces: 20, status: "published" },
    { id: "programme-fashion-start", providerId: "provider-stitchlab", title: "Fashion Design Starter", tradeCategory: "Fashion", description: "Pattern drafting, sewing, finishing. Beginner friendly.", state: "FCT", city: "Abuja", format: "offline" as const, duration: "6 weeks", costType: "sponsored" as const, certificationInfo: "Completion certificate", spaces: 25, status: "published" },
    { id: "programme-photo-online", providerId: "provider-stitchlab", title: "Photography Basics (Online)", tradeCategory: "Photography", description: "Camera basics, lighting, editing. Fully online.", state: "Lagos", city: "Lekki", format: "online" as const, duration: "4 weeks", costType: "free" as const, certificationInfo: "Completion certificate", spaces: 100, status: "published" },
    { id: "programme-plumbing", providerId: "provider-brightvolt", title: "Plumbing Essentials", tradeCategory: "Plumbing", description: "Pipework, fittings, repairs. Practical weekends.", state: "Lagos", city: "Surulere", format: "hybrid" as const, duration: "8 weeks", costType: "paid" as const, certificationInfo: "NSQ pathway (planned)", spaces: 15, status: "published" },
    { id: "programme-catering", providerId: "provider-stitchlab", title: "Catering & Small Chops", tradeCategory: "Catering", description: "Nigerian catering, costing, hygiene. Sponsored seats.", state: "FCT", city: "Abuja", format: "offline" as const, duration: "5 weeks", costType: "sponsored" as const, certificationInfo: "Completion certificate", spaces: 40, status: "published" },
    { id: "programme-welding-kano", providerId: "provider-kano-tech", title: "Welding & Fabrication Basics", tradeCategory: "Welding", description: "Arc welding, safety, joints. Hands-on workshop.", state: "Kano", city: "Kano", format: "offline" as const, duration: "8 weeks", costType: "free" as const, certificationInfo: "NSQ pathway (planned)", spaces: 20, status: "published" },
    { id: "programme-auto-kano", providerId: "provider-kano-tech", title: "Auto Mechanics Foundation", tradeCategory: "Automotive", description: "Engine basics, diagnostics, servicing.", state: "Kano", city: "Kano", format: "offline" as const, duration: "3 months", costType: "sponsored" as const, certificationInfo: "Completion certificate", spaces: 25, status: "published" },
    { id: "programme-construct-kano", providerId: "provider-kano-tech", title: "Construction Skills Intro", tradeCategory: "Construction", description: "Blocklaying, plastering, site safety.", state: "Kano", city: "Kano", format: "offline" as const, duration: "6 weeks", costType: "free" as const, certificationInfo: "", spaces: 30, status: "published" },
    { id: "programme-beauty-rivers", providerId: "provider-rivers-beauty", title: "Beauty & Hairdressing Starter", tradeCategory: "Beauty", description: "Braiding, styling, salon hygiene.", state: "Rivers", city: "Port Harcourt", format: "offline" as const, duration: "6 weeks", costType: "paid" as const, certificationInfo: "Completion certificate", spaces: 20, status: "published" },
    { id: "programme-carpentry-lagos", providerId: "provider-brightvolt", title: "Carpentry Foundations", tradeCategory: "Carpentry", description: "Woodwork, joints, furniture basics.", state: "Lagos", city: "Ikeja", format: "offline" as const, duration: "8 weeks", costType: "free" as const, certificationInfo: "", spaces: 18, status: "published" },
    { id: "programme-video-online", providerId: "provider-stitchlab", title: "Videography & Editing (Online)", tradeCategory: "Videography", description: "Shooting, editing, storytelling. Fully online.", state: "FCT", city: "Abuja", format: "online" as const, duration: "5 weeks", costType: "sponsored" as const, certificationInfo: "Completion certificate", spaces: 80, status: "published" },
    { id: "programme-photo-rivers", providerId: "provider-rivers-beauty", title: "Event Photography Practical", tradeCategory: "Photography", description: "Events, portraits, client delivery.", state: "Rivers", city: "Port Harcourt", format: "hybrid" as const, duration: "4 weeks", costType: "paid" as const, certificationInfo: "", spaces: 15, status: "published" },
    { id: "programme-electrical-kano", providerId: "provider-kano-tech", title: "Solar & Electrical Basics", tradeCategory: "Electrical Installation", description: "Solar installation plus home wiring.", state: "Kano", city: "Kano", format: "hybrid" as const, duration: "6 weeks", costType: "sponsored" as const, certificationInfo: "NSQ pathway (planned)", spaces: 35, status: "published" }
  ];

  for (const p of demos) {
    await db.insert(programmes).values(p).onConflictDoNothing();
  }
  console.log("Seeded demo providers + programmes:", demos.length);

  // Demo actors (FK targets for enrolments/applications/reviews/reports/opportunities)
  for (const u of [
    { id: "anonymous-learner", name: "Demo Learner", email: "learner@local.demo", role: "learner" },
    { id: "anonymous-org", name: "Demo Employer", email: "employer@local.demo", role: "employer" }
  ]) {
    await db.insert(user).values({ ...u, emailVerified: false }).onConflictDoNothing();
  }

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
