CREATE TABLE "ai_cache" (
	"key" text PRIMARY KEY NOT NULL,
	"input" jsonb,
	"output" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
