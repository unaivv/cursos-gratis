ALTER TABLE "courses" ADD COLUMN "ai_analysis" jsonb;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "ai_analyzed_at" timestamp with time zone;