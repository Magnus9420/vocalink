import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "./client";

async function main() {
  await migrate(db as never, { migrationsFolder: "./drizzle" });
  console.log("migrations applied");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
