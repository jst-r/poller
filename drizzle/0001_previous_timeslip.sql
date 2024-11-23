CREATE TABLE IF NOT EXISTS "polls" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"title" varchar NOT NULL,
	"description" varchar
);
