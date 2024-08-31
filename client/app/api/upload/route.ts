import { NextResponse } from "next/server";
import {
  BlobServiceClient,
  BlockBlobUploadStreamOptions,
} from "@azure/storage-blob";
import { Readable } from "stream";
import { updateProgress } from "../progress/route";

export async function POST(req: Request) {
  console.log("Parsing the request body");

  const formData = await req.formData();

  const videoFile = formData.get("video") as File;
  const videoName = formData.get("videoName") as string;
  const resolution = formData.get("resolution");
  const videoId = formData.get("videoId") as string;

  console.log(
    "Video file:",
    videoFile,
    "Video name:",
    videoName,
    "Resolution:",
    resolution
  );

  console.log("Uploading the file to Azure Blob Storage");

  if (!videoFile || !videoName || !resolution) {
    let message = "";
    if (!videoFile) {
      message = "No file uploaded";
    } else if (!videoName) {
      message = "No video name provided";
    } else if (!resolution) {
      message = "No resolution provided";
    }
    console.log(message);
    return NextResponse.json({ message }, { status: 400 });
  }
  const accountName = process.env.BLOB_RESOURCE_NAME;
  const sasToken = process.env.SAS_TOKEN_AZURE;
  const containerName = process.env.BLOB_CONTAINER_NAME;

  if (!containerName) {
    console.log("Container name not found");
    return NextResponse.json(
      { message: "Container name not found" },
      { status: 400 }
    );
  }

  const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net/?${sasToken}`
  );
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlockBlobClient(videoName);

  const videoBuffer = await videoFile.arrayBuffer();
  const buffer = Buffer.from(videoBuffer);

  const fileStream = Readable.from(buffer);

  const bufferSize = 4 * 1024 * 1024; // 4MB buffer size
  const maxConcurrency = 20; // 20 concurrent uploads
  const options: BlockBlobUploadStreamOptions = {
    blobHTTPHeaders: {
      blobContentType: videoFile.type, // Set the content type based on the file
    },
    onProgress: (progress) => {
      const progressPercentage = Math.floor(
        (progress.loadedBytes / buffer.length) * 100
      );
      console.log("Progress:", progressPercentage);
      updateProgress(videoId, progressPercentage);
    },
  };

  try {
    await blobClient.uploadStream(
      fileStream,
      bufferSize,
      maxConcurrency,
      options
    );
    console.log("File uploaded successfully");
    updateProgress(videoId, 100);
    return NextResponse.json(
      { message: "File uploaded successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Upload failed:", error);
    updateProgress(videoId, -1); // Set progress to -1 to indicate an error
    return NextResponse.json(
      { message: "Upload failed", error: error.message },
      { status: 500 }
    );
  }
}
