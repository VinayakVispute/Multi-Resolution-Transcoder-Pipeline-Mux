import { BlobServiceClient, BlockBlobClient } from "@azure/storage-blob";
import { updateProgress } from "@/utils/progress";

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function uploadVideoToAzureBlobFromURL(
  videoUrl: string, // Vercel-hosted video URL
  uniqueVideoName: string, // Name to store the video in Azure Blob Storage
  videoId: string, // Unique ID for tracking the upload progress
  resolution: string // Metadata for resolution
): Promise<UploadResult> {
  try {
    // Ensure Azure Blob Storage configuration values are set
    const accountName = process.env.BLOB_RESOURCE_NAME;
    const sasToken = process.env.SAS_TOKEN_AZURE;
    const containerName = process.env.BLOB_CONTAINER_NAME;

    if (!accountName || !sasToken || !containerName) {
      throw new Error("Missing Azure Blob Storage configuration.");
    }

    console.log("Azure Blob Storage config found, starting sync upload...");

    // Initialize Blob Service Client with SAS token
    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net/?${sasToken}`
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient: BlockBlobClient =
      containerClient.getBlockBlobClient(uniqueVideoName);

    // Azure Blob Storage upload options
    const options = {
      metadata: {
        uniqueId: videoId,
        currentResolution: resolution,
      },
    };

    // Use syncUploadFromURL to directly upload the video from the source URL
    console.log("Starting sync upload to Azure from URL...");
    const response = await blobClient.syncUploadFromURL(videoUrl, options);

    console.log("File uploaded successfully:", blobClient.url);

    return {
      success: true,
      url: blobClient.url,
    };
  } catch (error: any) {
    console.error("Azure Blob upload failed:", error.message || error);

    return {
      success: false,
      error: "Azure Blob upload failed.",
    };
  }
}
