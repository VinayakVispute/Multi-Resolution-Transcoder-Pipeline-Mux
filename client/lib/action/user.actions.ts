"use server";
import prisma from "@/lib/prisma";
import { createEdgePrismaClient } from "@/lib/prisma";

export const isUserEligibleForUpload = async (
  userId: string,
  videoSizeInMB: number
): Promise<boolean> => {
  // Maximum allowed size per video in MB
  const MAX_VIDEO_SIZE_MB = 50;
  const edgePrisma = createEdgePrismaClient();

  // Check if video exceeds allowed size
  if (videoSizeInMB > MAX_VIDEO_SIZE_MB) {
    console.error("Video size exceeds the allowed limit");
    return false;
  }

  // Fetch user details from the database
  const user = await edgePrisma.user.findUnique({
    where: { id: userId },
    select: {
      videosUploaded: true,
      maxVideosAllowed: true,
    },
  });

  // If user not found, or they have already uploaded the max allowed videos
  if (!user || user.videosUploaded >= user.maxVideosAllowed) {
    console.error("User has reached the maximum allowed video uploads");
    return false;
  }

  // If user is eligible to upload, return true
  console.log("User is eligible to upload the video");
  return true;
};

export const checkUserAPIKey = async (userId: string) => {
  // Fetch user details from the database
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: {
      apiKey: true,
    },
  });

  // If user not found, or they don't have an API key set
  if (!user || !user.apiKey) {
    return {
      success: false,
      data: null,
    };
  }

  // If user has an API key set, return true
  return {
    success: true,
    data: user.apiKey,
  };
};
