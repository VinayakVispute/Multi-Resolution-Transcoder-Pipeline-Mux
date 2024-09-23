import {
  BlobServiceClient,
  BlockBlobUploadStreamOptions,
} from "@azure/storage-blob";
import { Readable } from "stream";
import { updateProgress } from "@/utils/progress";

export async function uploadVideoToAzureBlob(
  videoFile: File,
  uniqueVideoName: string,
  videoId: string,
  resolution: string
): Promise<string> {
  try {
    // Azure Blob Storage configuration
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
        uniqueId: videoId,
        currentResolution: resolution,
      },
    };

    const bufferSize = 4 * 1024 * 1024; // 4MB buffer size
    const maxConcurrency = 20; // 20 concurrent uploads

    // Upload the video stream to Azure
    await blobClient.uploadStream(
      fileStream,
      bufferSize,
      maxConcurrency,
      options
    );

    console.log("File uploaded successfully:", blobClient.url);

    // Return the uploaded video's URL
    return blobClient.url;
  } catch (error: any) {
    console.error("Azure Blob upload failed:", error.message || error);
    throw new Error("Azure Blob upload failed");
  }
}
