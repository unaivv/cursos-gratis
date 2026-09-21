CREATE TABLE "rejected_videos" (
	"video_id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"reason" text NOT NULL,
	"source" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
