import { put, del } from "@vercel/blob";

interface UploadResult {
  success: boolean;
  data?: {
    url: string;
    file_key: string;
    file_name: string;
  };
  error?: string;
}

export async function uploadToVercelStorage(file: File): Promise<UploadResult> {
  console.log("Starting upload process...");
  const startTime = Date.now();

  try {
    // Create a unique file key using the current timestamp and replacing spaces with hyphens in the file name
    const fileKey = `uploads/${Date.now().toString()}_${file.name.replace(
      /\s+/g,
      "-"
    )}`;
    console.log(`Generated file key: ${fileKey}`);

    // Upload the file to Vercel Blob storage with public access
    const blob = await put(fileKey, file, {
      access: "public",
      token: process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN,
    });
    console.log(`File uploaded successfully. Blob URL: ${blob.url}`);

    // Return success response with file URL and metadata
    const endTime = Date.now();
    console.log(`Upload process completed in ${endTime - startTime} ms`);
    return {
      success: true,
      data: {
        url: blob.url,
        file_key: fileKey,
        file_name: file.name,
      },
    };
  } catch (error) {
    console.error("Upload to Vercel Blob failed:", error);

    // Return failure response with error message
    const endTime = Date.now();
    console.log(`Upload process failed in ${endTime - startTime} ms`);
    return {
      success: false,
      error: "Failed to upload file to Vercel Blob storage.",
    };
  }
}
