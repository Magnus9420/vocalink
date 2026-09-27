CREATE TABLE "trades" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" text DEFAULT 'Vocational' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "trades_name_unique" UNIQUE("name")
);
