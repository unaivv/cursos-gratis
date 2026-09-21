ALTER TABLE "courses" ADD COLUMN "ai_summary" text;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "ai_overview" text;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "ai_highlights" jsonb;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "ai_level" text;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "ai_generated_at" timestamp with time zone;