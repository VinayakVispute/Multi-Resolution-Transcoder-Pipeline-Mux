export const runtime = "edge";

import { NextResponse } from "next/server";
import {
  BlobServiceClient,
  BlockBlobUploadStreamOptions,
} from "@azure/storage-blob";
import { Readable } from "stream";
import { createdUploadedVideoInDb } from "@/lib/action/video.action";
import { v4 as uuidv4 } from "uuid";
import { updateProgress } from "@/utils/progress";
import { currentUser } from "@clerk/nextjs/server";
import { isUserEligibleForUpload } from "@/lib/action/user.actions";

export async function POST(req: Request) {
  const formData = await req.formData();
  console.log("Form data parsed successfully");

  const videoFile = formData.get("video") as File;
  const videoName = formData.get("videoName") as string;
  const resolution = formData.get("resolution");
  const videoId = formData.get("videoId") as string;
  try {
    console.log("Starting to process the request...");

    console.log(`Received video: ${videoName}, resolution: ${resolution}`);

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

    const videoBuffer = await videoFile.arrayBuffer();
    const buffer = Buffer.from(videoBuffer);
    const fileStream = Readable.from(buffer);

    const options: BlockBlobUploadStreamOptions = {
      blobHTTPHeaders: {
        blobContentType: videoFile.type,
      },
      onProgress: (progress) => {
        const progressPercentage = Math.floor(
          (progress.loadedBytes / buffer.length) * 100
        );
        console.log(`Progress: ${progressPercentage}%`);
        updateProgress(videoId, progressPercentage);
      },
      metadata: {
        uniqueId,
        currentResolution: resolution as string,
      },
    };

    const bufferSize = 4 * 1024 * 1024; // 4MB buffer size
    const maxConcurrency = 20; // 20 concurrent uploads

    console.log("Uploading the video to Azure Blob Storage...");
    const response = await blobClient.uploadStream(
      fileStream,
      bufferSize,
      maxConcurrency,
      options
    );

    console.log("File uploaded successfully:", blobClient.url);

    // Retrieve and log the metadata of the uploaded blob
    const properties = await blobClient.getProperties();
    console.log("Blob properties:", properties);

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
