import { db } from "./client";
import { featureFlags, certificationPathways } from "./schema/core";
import { randomUUID } from "crypto";

const TRADES = [
  "Fashion", "Catering", "Welding", "Plumbing", "Carpentry",
  "Electrical Installation", "Photography", "Videography",
  "Beauty", "Construction", "Automotive"
];

async function main() {
  console.log("Seeding trades:", TRADES.join(", "));

  const flags = [
    "guided_discovery",
    "reviews",
    "jobs",
    "internships",
    "provider_reg",
    "employer_reg"
  ];

  for (const key of flags) {
    await db
      .insert(featureFlags)
      .values({ key, enabled: true })
      .onConflictDoNothing();
  }

  await db
    .insert(certificationPathways)
    .values({
      id: randomUUID(),
      trade: "Electrical Installation",
      body: "NSQ-related body (placeholder)",
      steps: ["Complete training", "Book assessment", "Pass assessment", "Get certified"],
      assessmentLocation: "Approved centre — Lagos (placeholder)",
      requirements: "Training completion + ID",
      isNsqRelated: true
    })
    .onConflictDoNothing();

  console.log("Seed done. Run next: pnpm --filter @vocalink/web dev");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
