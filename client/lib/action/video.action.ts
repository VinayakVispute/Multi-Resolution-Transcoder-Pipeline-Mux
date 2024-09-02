"use server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { createUploadVideoInDbParams, UploadedVideo } from "@/interface";
import { revalidatePath } from "next/cache";
import { Status } from "@prisma/client";

// TODO: Implement revalidation and error handling

export const createdUploadedVideoInDb = async (
  params: createUploadVideoInDbParams
) => {
  try {
    const user = await currentUser();

    if (!user || !user.privateMetadata || !user.privateMetadata.userId) {
      console.error("User authentication failed");
      return JSON.parse(
        JSON.stringify({
          success: false,
          message: "User authentication failed",
        })
      );
    }
    const userId = user.privateMetadata.userId as string;

    const { id, title, videoUrl, resolution } = params;

    const newVideo = await prisma.video.create({
      data: {
        title: title,
        videoUrl: videoUrl,
        resolution: resolution,
      },
    });

    const newUploadedVideo = await prisma.uploadedVideo.create({
      data: {
        id: id,
        userId: userId,
        status: "PENDING",
        videoId: newVideo.id, // Link the newly created Video
      },
    });

    if (!newUploadedVideo) {
      console.error("Failed to create new uploaded video");
      return JSON.parse(
        JSON.stringify({
          success: false,
          message: "Failed to create new uploaded video",
        })
      );
    }

    revalidatePath("/History");
    return JSON.parse(
      JSON.stringify({
        success: true,
        data: newUploadedVideo,
        message: "Video uploaded successfully",
      })
    );
  } catch (error) {
    console.error("An error occurred:", error);
    return JSON.parse(
      JSON.stringify({
        success: false,
        message: "Failed to upload video",
      })
    );
  }
};

export const fetchUploadedVideos = async (): Promise<{
  success: boolean;
  data: UploadedVideo[];
  message: string;
}> => {
  try {
    const user = await currentUser();

    if (!user || !user.privateMetadata || !user.privateMetadata.userId) {
      console.error("User authentication failed");
      return JSON.parse(
        JSON.stringify({
          success: false,
          message: "User authentication failed",
          data: [],
        })
      );
    }
    const userId = user.privateMetadata.userId;

    const uploadedVideos = await prisma.uploadedVideo.findMany({
      where: {
        userId: userId,
      },
      include: {
        video: true,
        TranscodedVideo: {
          include: {
            video: true,
          },
        },
      },
    });

    return JSON.parse(
      JSON.stringify({
        success: true,
        data: uploadedVideos,
        message: "Uploaded videos fetched successfully",
      })
    );
  } catch (error) {
    console.error("An error occurred:", error);
    return JSON.parse(
      JSON.stringify({
        success: false,
        message: "Failed to fetch uploaded videos",
        data: [],
      })
    );
  }
};

export const createAndLinkTranscodedVideos = async (
  uniqueId: string,
  status: Status,
  videoData: Array<{ name: string; url: string; resolution: string }>
) => {
  try {
    // Step 1: Create multiple Video records
    const createdVideos = await prisma.video.createManyAndReturn({
      data: videoData.map((video) => ({
        title: video.name,
        videoUrl: video.url,
        resolution: video.resolution,
      })),
      select: {
        id: true,
      },
    });

    console.log("createdVideos", createdVideos);

    if (!createdVideos || createdVideos.length === 0) {
      throw new Error("Failed to create videos");
    }

    // Extract the video IDs (this will depend on the database being used)
    const videoIds = createdVideos.map((video) => video.id);
    console.log("videoIds", videoIds);

    // Step 2: Create multiple TranscodedVideo records referencing the video IDs

    const tempObj = videoIds.map((videoId) => ({
      sourceVideoId: uniqueId,
      videoId: videoId,
    }));

    console.log("tempObj", tempObj);
    const transcodedVideos = await prisma.transcodedVideo.createMany({
      data: tempObj,
    });

    if (transcodedVideos.count === 0) {
      throw new Error("Failed to create transcoded videos");
    }

    // Step 3: Update the status of UploadedVideo
    const updatedUploadedVideo = await prisma.uploadedVideo.update({
      where: { id: uniqueId },
      data: {
        status: status,
      },
    });

    if (!updatedUploadedVideo) {
      throw new Error("Failed to update the uploaded video status");
    }

    return {
      success: true,
      message:
        "Transcoded videos created and uploaded video updated successfully",
    };
  } catch (error: any) {
    console.error("Error in createAndLinkTranscodedVideos:", error);
    return { success: false, message: error.message };
  }
};
