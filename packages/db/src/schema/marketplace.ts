import { pgTable, text, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const notifications = pgTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  title: text("title").notNull(),
  body: text("body"),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

export const notificationPrefs = pgTable("notification_prefs", {
  userId: text("user_id").primaryKey().references(() => user.id, { onDelete: "cascade" }),
  categories: jsonb("categories").$type<string[]>().default(["training", "certification", "work", "messages"]),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

export const conversations = pgTable("conversations", {
  id: text("id").primaryKey(),
  subject: text("subject").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

export const messages = pgTable("messages", {
  id: text("id").primaryKey(),
  conversationId: text("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  senderId: text("sender_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  body: text("body").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

// Phase 9: cache for AI guidance responses (same answers = zero repeat API calls)
export const aiCache = pgTable("ai_cache", {
  key: text("key").primaryKey(),
  input: jsonb("input"),
  output: jsonb("output"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
