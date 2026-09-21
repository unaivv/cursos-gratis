ALTER TABLE "courses" ADD COLUMN "editor_note" text;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "duration_seconds" integer;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "lesson_count" integer;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "chapters" jsonb;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "published_at" date;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "enriched_at" timestamp with time zone;