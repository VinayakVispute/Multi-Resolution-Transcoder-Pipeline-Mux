import { relations } from "drizzle-orm/relations";
import { video, transcodedVideo, uploadedVideo, user, notifications } from "./schema";

export const transcodedVideoRelations = relations(transcodedVideo, ({one}) => ({
	video: one(video, {
		fields: [transcodedVideo.videoId],
		references: [video.id]
	}),
	uploadedVideo: one(uploadedVideo, {
		fields: [transcodedVideo.sourceVideoId],
		references: [uploadedVideo.id]
	}),
}));

export const videoRelations = relations(video, ({many}) => ({
	transcodedVideos: many(transcodedVideo),
	uploadedVideos: many(uploadedVideo),
}));

export const uploadedVideoRelations = relations(uploadedVideo, ({one, many}) => ({
	transcodedVideos: many(transcodedVideo),
	video: one(video, {
		fields: [uploadedVideo.videoId],
		references: [video.id]
	}),
	user: one(user, {
		fields: [uploadedVideo.userId],
		references: [user.id]
	}),
	notifications: many(notifications),
}));

export const userRelations = relations(user, ({many}) => ({
	uploadedVideos: many(uploadedVideo),
	notifications: many(notifications),
}));

export const notificationsRelations = relations(notifications, ({one}) => ({
	user: one(user, {
		fields: [notifications.userId],
		references: [user.id]
	}),
	uploadedVideo: one(uploadedVideo, {
		fields: [notifications.uploadedVideoId],
		references: [uploadedVideo.id]
	}),
}));