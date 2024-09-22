import { pgTable, varchar, timestamp, text, integer, serial, foreignKey, uniqueIndex, boolean, pgEnum } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const event = pgEnum("Event", ['NEW_VIDEO', 'TRANSCODED_VIDEO'])
export const eventStatus = pgEnum("EventStatus", ['FINISHED', 'FAILED'])
export const status = pgEnum("Status", ['PENDING', 'FINISHED', 'FAILED'])



export const prismaMigrations = pgTable("_prisma_migrations", {
	id: varchar("id", { length: 36 }).primaryKey().notNull(),
	checksum: varchar("checksum", { length: 64 }).notNull(),
	finishedAt: timestamp("finished_at", { withTimezone: true, mode: 'string' }),
	migrationName: varchar("migration_name", { length: 255 }).notNull(),
	logs: text("logs"),
	rolledBackAt: timestamp("rolled_back_at", { withTimezone: true, mode: 'string' }),
	startedAt: timestamp("started_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	appliedStepsCount: integer("applied_steps_count").default(0).notNull(),
});

export const video = pgTable("Video", {
	id: serial("id").primaryKey().notNull(),
	title: text("title").notNull(),
	videoUrl: text("videoUrl").notNull(),
	uploadedAt: timestamp("uploadedAt", { precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	resolution: text("resolution").notNull(),
});

export const transcodedVideo = pgTable("TranscodedVideo", {
	id: text("id").primaryKey().notNull(),
	transcodedAt: timestamp("transcodedAt", { precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	sourceVideoId: text("sourceVideoId").notNull(),
	videoId: integer("videoId").notNull(),
	uploadedAt: timestamp("uploadedAt", { precision: 3, mode: 'string' }).notNull(),
},
(table) => {
	return {
		transcodedVideoVideoIdFkey: foreignKey({
			columns: [table.videoId],
			foreignColumns: [video.id],
			name: "TranscodedVideo_videoId_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
		transcodedVideoSourceVideoIdFkey: foreignKey({
			columns: [table.sourceVideoId],
			foreignColumns: [uploadedVideo.id],
			name: "TranscodedVideo_sourceVideoId_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	}
});

export const uploadedVideo = pgTable("UploadedVideo", {
	id: text("id").primaryKey().notNull(),
	userId: text("userId").notNull(),
	status: status("status").default('PENDING').notNull(),
	videoId: integer("videoId").notNull(),
	uploadedAt: timestamp("uploadedAt", { precision: 3, mode: 'string' }).notNull(),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
},
(table) => {
	return {
		uploadedVideoVideoIdFkey: foreignKey({
			columns: [table.videoId],
			foreignColumns: [video.id],
			name: "UploadedVideo_videoId_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
		uploadedVideoUserIdFkey: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "UploadedVideo_userId_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	}
});

export const user = pgTable("User", {
	id: text("id").primaryKey().notNull(),
	clerkId: text("clerkId").notNull(),
	name: text("name").notNull(),
	userName: text("userName").notNull(),
	email: text("email").notNull(),
	picture: text("picture").default('https://res.cloudinary.com/dkawvablj/image/upload/v1725119468/Core/mwpxqnn5viel4zddmng7.jpg').notNull(),
	joinedAt: timestamp("joinedAt", { precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	apiKey: text("apiKey"),
	maxVideosAllowed: integer("maxVideosAllowed").default(1).notNull(),
	videosUploaded: integer("videosUploaded").default(0).notNull(),
},
(table) => {
	return {
		apiKeyKey: uniqueIndex("User_apiKey_key").using("btree", table.apiKey.asc().nullsLast()),
		clerkIdKey: uniqueIndex("User_clerkId_key").using("btree", table.clerkId.asc().nullsLast()),
		userNameKey: uniqueIndex("User_userName_key").using("btree", table.userName.asc().nullsLast()),
	}
});

export const notifications = pgTable("Notifications", {
	id: text("id").primaryKey().notNull(),
	userId: text("userId").notNull(),
	read: boolean("read").default(false).notNull(),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	event: eventStatus("event").notNull(),
	uploadedVideoId: text("uploadedVideoId").notNull(),
},
(table) => {
	return {
		notificationsUserIdFkey: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "Notifications_userId_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
		notificationsUploadedVideoIdFkey: foreignKey({
			columns: [table.uploadedVideoId],
			foreignColumns: [uploadedVideo.id],
			name: "Notifications_uploadedVideoId_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	}
});