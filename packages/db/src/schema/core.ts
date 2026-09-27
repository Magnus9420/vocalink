// VocaLink core domain — Phase 0 minimal, expandable per phases 1-7.
import { pgTable, text, timestamp, integer, boolean, pgEnum, jsonb } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const roleEnum = pgEnum("role", ["learner", "provider_staff", "employer", "org_partner", "admin"]);
export const verificationStatusEnum = pgEnum("verification_status", ["pending", "approved", "needs_info", "rejected"]);
export const costTypeEnum = pgEnum("cost_type", ["free", "sponsored", "paid"]);
export const formatEnum = pgEnum("programme_format", ["online", "offline", "hybrid"]);

export const profiles = pgTable("profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().unique().references(() => user.id, { onDelete: "cascade" }),
  displayName: text("display_name"),
  state: text("state"),
  city: text("city"),
  avatarR2Key: text("avatar_r2_key"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

export const learnerProfiles = pgTable("learner_profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().unique().references(() => user.id, { onDelete: "cascade" }),
  ageRange: text("age_range"),
  education: text("education"),
  existingSkills: jsonb("existing_skills").$type<string[]>().default([]),
  interests: jsonb("interests").$type<string[]>().default([]),
  preferredFormat: text("preferred_format"),
  budget: text("budget"),
  availability: text("availability")
});

export const providers = pgTable("providers", {
  id: text("id").primaryKey(),
  ownerUserId: text("owner_user_id").references(() => user.id),
  name: text("name").notNull(),
  type: text("type"),
  bio: text("bio"),
  state: text("state"),
  city: text("city"),
  verificationStatus: verificationStatusEnum("verification_status").notNull().default("pending"),
  contact: text("contact"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

export const providerVerifications = pgTable("provider_verifications", {
  id: text("id").primaryKey(),
  providerId: text("provider_id").notNull().references(() => providers.id, { onDelete: "cascade" }),
  evidenceR2Keys: jsonb("evidence_r2_keys").$type<string[]>().default([]),
  status: verificationStatusEnum("status").notNull().default("pending"),
  reviewerUserId: text("reviewer_user_id").references(() => user.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

export const programmes = pgTable("programmes", {
  id: text("id").primaryKey(),
  providerId: text("provider_id").notNull().references(() => providers.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  tradeCategory: text("trade_category").notNull(),
  description: text("description"),
  state: text("state"),
  city: text("city"),
  format: formatEnum("format").notNull().default("offline"),
  duration: text("duration"),
  startDate: timestamp("start_date"),
  costType: costTypeEnum("cost_type").notNull().default("free"),
  costAmount: integer("cost_amount"),
  certificationInfo: text("certification_info"),
  entryRequirements: text("entry_requirements"),
  curriculum: jsonb("curriculum").$type<string[]>().default([]),
  spaces: integer("spaces"),
  status: text("status").notNull().default("draft"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

export const enrolments = pgTable("enrolments", {
  id: text("id").primaryKey(),
  learnerUserId: text("learner_user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  programmeId: text("programme_id").notNull().references(() => programmes.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("enrolled"),
  progress: integer("progress").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

export const reviews = pgTable("reviews", {
  id: text("id").primaryKey(),
  learnerUserId: text("learner_user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  programmeId: text("programme_id").notNull().references(() => programmes.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(),
  body: text("body"),
  moderationStatus: text("moderation_status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

export const reports = pgTable("reports", {
  id: text("id").primaryKey(),
  reporterUserId: text("reporter_user_id").references(() => user.id),
  targetType: text("target_type").notNull(),
  targetId: text("target_id").notNull(),
  reason: text("reason").notNull(),
  status: text("status").notNull().default("open"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

export const certificationPathways = pgTable("certification_pathways", {
  id: text("id").primaryKey(),
  trade: text("trade").notNull(),
  body: text("body").notNull(),
  steps: jsonb("steps").$type<string[]>().default([]),
  assessmentLocation: text("assessment_location"),
  requirements: text("requirements"),
  isNsqRelated: boolean("is_nsq_related").notNull().default(false)
});

export const learnerCertifications = pgTable("learner_certifications", {
  id: text("id").primaryKey(),
  learnerUserId: text("learner_user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  pathwayId: text("pathway_id").notNull().references(() => certificationPathways.id),
  status: text("status").notNull().default("interested"),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

export const portfolios = pgTable("portfolios", {
  id: text("id").primaryKey(),
  learnerUserId: text("learner_user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  trade: text("trade"),
  mediaR2Keys: jsonb("media_r2_keys").$type<string[]>().default([]),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

export const opportunities = pgTable("opportunities", {
  id: text("id").primaryKey(),
  orgUserId: text("org_user_id").references(() => user.id),
  type: text("type").notNull(),
  role: text("role").notNull(),
  trade: text("trade"),
  state: text("state"),
  city: text("city"),
  paidStatus: text("paid_status"),
  requirements: text("requirements"),
  status: text("status").notNull().default("open"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

export const applications = pgTable("applications", {
  id: text("id").primaryKey(),
  learnerUserId: text("learner_user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  opportunityId: text("opportunity_id").notNull().references(() => opportunities.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("applied"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

export const featureFlags = pgTable("feature_flags", {
  key: text("key").primaryKey(),
  enabled: boolean("enabled").notNull().default(true),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
