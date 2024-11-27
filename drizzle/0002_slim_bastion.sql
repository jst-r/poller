CREATE TYPE "public"."poll_type" AS ENUM('SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TEXT');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "options_votes" (
	"voteId" integer NOT NULL,
	"optionId" integer NOT NULL,
	CONSTRAINT "options_votes_voteId_optionId_pk" PRIMARY KEY("voteId","optionId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "poll_options" (
	"id" serial PRIMARY KEY NOT NULL,
	"pollId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"text" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "text_votes" (
	"id" serial PRIMARY KEY NOT NULL,
	"voteId" integer NOT NULL,
	"text" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "votes" (
	"id" serial PRIMARY KEY NOT NULL,
	"pollId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "polls" RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
ALTER TABLE "polls" ADD COLUMN "type" "poll_type";--> statement-breakpoint
ALTER TABLE "polls" ADD COLUMN "config" jsonb;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "options_votes" ADD CONSTRAINT "options_votes_voteId_votes_id_fk" FOREIGN KEY ("voteId") REFERENCES "public"."votes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "options_votes" ADD CONSTRAINT "options_votes_optionId_poll_options_id_fk" FOREIGN KEY ("optionId") REFERENCES "public"."poll_options"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "poll_options" ADD CONSTRAINT "poll_options_pollId_polls_id_fk" FOREIGN KEY ("pollId") REFERENCES "public"."polls"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "text_votes" ADD CONSTRAINT "text_votes_voteId_votes_id_fk" FOREIGN KEY ("voteId") REFERENCES "public"."votes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "votes" ADD CONSTRAINT "votes_pollId_polls_id_fk" FOREIGN KEY ("pollId") REFERENCES "public"."polls"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
