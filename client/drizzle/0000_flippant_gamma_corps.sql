-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations

DO $$ BEGIN
 CREATE TYPE "public"."Event" AS ENUM('NEW_VIDEO', 'TRANSCODED_VIDEO');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."EventStatus" AS ENUM('FINISHED', 'FAILED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."Status" AS ENUM('PENDING', 'FINISHED', 'FAILED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"checksum" varchar(64) NOT NULL,
	"finished_at" timestamp with time zone,
	"migration_name" varchar(255) NOT NULL,
	"logs" text,
	"rolled_back_at" timestamp with time zone,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"applied_steps_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Video" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"videoUrl" text NOT NULL,
	"uploadedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"resolution" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "TranscodedVideo" (
	"id" text PRIMARY KEY NOT NULL,
	"transcodedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"sourceVideoId" text NOT NULL,
	"videoId" integer NOT NULL,
	"uploadedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UploadedVideo" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"status" "Status" DEFAULT 'PENDING' NOT NULL,
	"videoId" integer NOT NULL,
	"uploadedAt" timestamp(3) NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "User" (
	"id" text PRIMARY KEY NOT NULL,
	"clerkId" text NOT NULL,
	"name" text NOT NULL,
	"userName" text NOT NULL,
	"email" text NOT NULL,
	"picture" text DEFAULT 'https://res.cloudinary.com/dkawvablj/image/upload/v1725119468/Core/mwpxqnn5viel4zddmng7.jpg' NOT NULL,
	"joinedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"apiKey" text,
	"maxVideosAllowed" integer DEFAULT 1 NOT NULL,
	"videosUploaded" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Notifications" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"event" "EventStatus" NOT NULL,
	"uploadedVideoId" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TranscodedVideo" ADD CONSTRAINT "TranscodedVideo_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "public"."Video"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TranscodedVideo" ADD CONSTRAINT "TranscodedVideo_sourceVideoId_fkey" FOREIGN KEY ("sourceVideoId") REFERENCES "public"."UploadedVideo"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UploadedVideo" ADD CONSTRAINT "UploadedVideo_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "public"."Video"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UploadedVideo" ADD CONSTRAINT "UploadedVideo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_uploadedVideoId_fkey" FOREIGN KEY ("uploadedVideoId") REFERENCES "public"."UploadedVideo"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "User_apiKey_key" ON "User" USING btree ("apiKey");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "User_clerkId_key" ON "User" USING btree ("clerkId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "User_userName_key" ON "User" USING btree ("userName");
