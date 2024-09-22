import { NextResponse } from "next/server";
import {
  BlobServiceClient,
  BlockBlobUploadStreamOptions,
} from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";
import { updateProgress } from "@/utils/progress";
import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";

export const runtime = "edge";

// Initialize Prisma with NeonDB
const neon = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaNeon(neon);
const prisma = new PrismaClient({ adapter });

export async function POST(req: Request) {
  const formData = await req.formData();
  console.log("Form data parsed successfully");

  const videoFile = formData.get("video") as File;
  const videoName = formData.get("videoName") as string;
  const resolution = formData.get("resolution");
  const videoId = formData.get("videoId") as string;

  try {
    console.log("Starting to process the request...");

    const uniqueId = uuidv4(); // Generate a UUID
    console.log(`Generated unique video ID: ${uniqueId}`);

    const user = await currentUser();
    console.log("Retrieved current user");

    if (!user || !user.privateMetadata?.userId) {
      throw new Error("User authentication failed");
    }

    const userId = user.privateMetadata.userId as string;
    console.log(`User ID: ${userId}`);

    if (!videoFile || !videoName || !resolution) {
      const missingField = !videoFile
        ? "video file"
        : !videoName
        ? "video name"
        : "resolution";
      throw new Error(`Missing required field: ${missingField}`);
    }

    const videoSizeInMB = videoFile.size / (1024 * 1024); // Convert to MB
    console.log(`Video size in MB: ${videoSizeInMB}`);

    const userEligible = await isUserEligibleForUpload(userId, videoSizeInMB);
    console.log(`Is user eligible for upload? ${userEligible}`);

    if (!userEligible) {
      console.error("User is not eligible to upload this video");
      throw new Error(
        "User is not eligible to upload this video, Check your plan"
      );
    }

    const fileExtension = videoName.split(".").pop();
    const baseName = videoName.substring(0, videoName.lastIndexOf("."));
    const uniqueVideoName = `${baseName}_${uniqueId}.${fileExtension}`; // Create a unique video name with extension
    console.log(`Unique video name: ${uniqueVideoName}`);

    const accountName = process.env.BLOB_RESOURCE_NAME;
    const sasToken = process.env.SAS_TOKEN_AZURE;
    const containerName = process.env.BLOB_CONTAINER_NAME;

    if (!accountName || !sasToken || !containerName) {
      throw new Error("Missing Azure Blob Storage configuration");
    }

    console.log("Azure Blob Storage config found, starting upload...");

    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net/?${sasToken}`
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlockBlobClient(uniqueVideoName);

    const arrayBuffer = await videoFile.arrayBuffer();

    const options: BlockBlobUploadStreamOptions = {
      blobHTTPHeaders: {
        blobContentType: videoFile.type,
      },
      onProgress: (progress) => {
        const progressPercentage = Math.floor(
          (progress.loadedBytes / videoFile.size) * 100
        );
        console.log(`Progress: ${progressPercentage}%`);
        updateProgress(videoId, progressPercentage);
      },
      metadata: {
        uniqueId,
        currentResolution: resolution as string,
      },
    };

    console.log("Uploading the video to Azure Blob Storage...");
    await blobClient.upload(arrayBuffer, arrayBuffer.byteLength, options);
    console.log("File uploaded successfully:", blobClient.url);

    updateProgress(videoId, 100);

    // Save video data to the database
    await createdUploadedVideoInDb({
      id: uniqueId,
      title: videoName,
      videoUrl: blobClient.url,
      resolution: resolution as string,
    });
    console.log("Video data saved to the database");

    return NextResponse.json(
      { message: "File uploaded successfully", videoUrl: blobClient.url },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Upload failed:", error.message || error);
    updateProgress(videoId, -1);
    return NextResponse.json(
      { message: "Upload failed", error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}

// Inline the `createdUploadedVideoInDb` function
async function createdUploadedVideoInDb(params: {
  id: string;
  title: string;
  videoUrl: string;
  resolution: string;
}) {
  try {
    const user = await currentUser();

    if (!user || !user.privateMetadata || !user.privateMetadata.userId) {
      console.error("User authentication failed");
      return {
        success: false,
        message: "User authentication failed",
      };
    }

    const userId = user.privateMetadata.userId as string;
    const { id, title, videoUrl, resolution } = params;

    // Use a transaction to combine both operations atomically
    const result = await prisma.$transaction(async (prisma) => {
      // Create the new video
      const newVideo = await prisma.video.create({
        data: {
          title: title,
          videoUrl: videoUrl,
          resolution: resolution,
        },
      });

      // Create the uploaded video linked to the user and new video
      const newUploadedVideo = await prisma.uploadedVideo.create({
        data: {
          id: id,
          userId: userId,
          status: "PENDING",
          videoId: newVideo.id, // Link the newly created Video
        },
      });

      // Increment videos uploaded by the user
      const incrementResponse = await prisma.user.update({
        where: { id: userId },
        data: {
          videosUploaded: { increment: 1 },
        },
      });
      console.log("incrementResponse", incrementResponse);
      return newUploadedVideo;
    });

    return {
      success: true,
      data: result,
      message: "Video uploaded and user video count updated successfully",
    };
  } catch (error) {
    console.error("An error occurred:", error);
    return {
      success: false,
      message: "Failed to upload video and update user",
    };
  }
}

// Inline the `isUserEligibleForUpload` function
async function isUserEligibleForUpload(
  userId: string,
  videoSizeInMB: number
): Promise<boolean> {
  // Maximum allowed size per video in MB
  const MAX_VIDEO_SIZE_MB = 50;

  // Check if video exceeds allowed size
  if (videoSizeInMB > MAX_VIDEO_SIZE_MB) {
    console.error("Video size exceeds the allowed limit");
    return false;
  }

  // Fetch user details from the database
  const user = await prisma.user.findUnique({
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
}
