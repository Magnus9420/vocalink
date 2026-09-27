import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const trades = pgTable("trades", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  category: text("category").notNull().default("Vocational"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
