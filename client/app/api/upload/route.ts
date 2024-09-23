import { NextResponse } from "next/server";
import { createdUploadedVideoInDb } from "@/lib/action/video.action";
import { v4 as uuidv4 } from "uuid";
import { updateProgress } from "@/utils/progress";
import { currentUser } from "@clerk/nextjs/server";
import { isUserEligibleForUpload } from "@/lib/action/user.actions";
import { uploadVideoToAzureBlobFromURL } from "@/lib/azureBlobUpload";
import { del } from "@vercel/blob";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const formData = await req.formData();
  console.log("Form data parsed successfully");

  const videoUrl = formData.get("videoUrl") as string;
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

    if (!videoUrl || !videoName || !resolution) {
      const missingField = !videoUrl
        ? "video file"
        : !videoName
        ? "video name"
        : "resolution";
      throw new Error(`Missing required field: ${missingField}`);
    }

    // const videoSizeInMB = videoFile.size / (1024 * 1024); // Convert to MB
    // console.log(`Video size in MB: ${videoSizeInMB}`);

    const userEligible = await isUserEligibleForUpload(userId, 0);
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
    // Upload video to Azure Blob using the helper function
    const azureVideoUrl = await uploadVideoToAzureBlobFromURL(
      videoUrl,
      uniqueVideoName,
      videoId,
      resolution as string
    );
    console.log("File uploaded successfully:", azureVideoUrl);

    // Retrieve and log the metadata of the uploaded blob
    updateProgress(videoId, 100);
    if (!azureVideoUrl.url) {
      throw new Error("Azure upload failed");
    }
    console.log("Azure video URL:", azureVideoUrl.url);
    // Save video data to the database
    await createdUploadedVideoInDb({
      id: uniqueId,
      title: videoName,
      videoUrl: azureVideoUrl.url,
      resolution: resolution as string,
    });
    console.log("Video data saved to the database");
    del(videoUrl, {
      token: process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN || "",
    });
    return NextResponse.json(
      { message: "File uploaded successfully", videoUrl: videoUrl },
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
