const { BlobServiceClient } = require("@azure/storage-blob");
const dotenv = require("dotenv");
const path = require("node:path");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const axios = require("axios");
dotenv.config();

const RESOLUTIONS = [
  {
    name: "360p",
    width: 480,
    height: 360,
  },
  {
    name: "480p",
    width: 858,
    height: 480,
  },
  {
    name: "720p",
    width: 1280,
    height: 720,
  },
];

const AZURE_STORAGE_CONNECTION_STRING =
  process.env.AZURE_STORAGE_CONNECTION_STRING;
const BUCKET_NAME = process.env.BUCKET_NAME;
const INPUT_VIDEO = process.env.INPUT_VIDEO;
const OUTPUT_VIDEO_BUCKET = process.env.OUTPUT_VIDEO_BUCKET;
const WEBHOOK_URL = process.env.WEBHOOK_URL;
if (
  !AZURE_STORAGE_CONNECTION_STRING ||
  !BUCKET_NAME ||
  !WEBHOOK_URL ||
  !INPUT_VIDEO
) {
  throw new Error(
    "AZURE_STORAGE_CONNECTION_STRING, BUCKET_NAME, or INPUT_VIDEO is not defined in environment variables."
  );
}

const blobServiceClient = BlobServiceClient.fromConnectionString(
  AZURE_STORAGE_CONNECTION_STRING
);

async function sendWebhook(params) {
  const { success, message, data } = params;
  console.log("Sending webhook:", {
    success,
    message,
    data: JSON.stringify(data, null, 2),
  });
  if (!success || !message || !data) {
    throw new Error("Invalid webhook parameters");
  }

  try {
    const { transcodedVideo, uniqueId } = data;
    if (!uniqueId || !transcodedVideo) {
      throw new Error("Invalid webhook data parameters");
    }

    await axios.post(`${WEBHOOK_URL}/api/webhooks/update-status`, {
      success,
      message,
      data: {
        uniqueId,
        transcodedVideo,
      },
    });
    console.log("Webhook sent:", { success, message });
  } catch (error) {
    console.error("Error sending webhook:", error);
  }
}

async function init() {
  const transcodedVideo = [];

  try {
    console.log("Starting video processing...");

    // Validate the input video name
    const inputVideoName = path.parse(INPUT_VIDEO).name;
    const inputVideoExtension = path.parse(INPUT_VIDEO).ext;

    if (!inputVideoName || !inputVideoExtension) {
      throw new Error("Invalid input video file name or extension.");
    }

    // Download the original video
    const containerClient = blobServiceClient.getContainerClient(BUCKET_NAME);
    const blobClient = containerClient.getBlobClient(INPUT_VIDEO);
    const { metadata } = await blobClient.getProperties();

    if (!metadata || !metadata.uniqueid) {
      throw new Error("No metadata found for the video");
    }

    const { uniqueid } = metadata;

    console.log("This is the metadata", metadata);
    console.log(`Downloading video from blob: ${INPUT_VIDEO}`);
    const downloadFilePath = path.join(
      __dirname,
      `original-video${inputVideoExtension}`
    );

    await blobClient.downloadToFile(downloadFilePath);
    console.log(`Download complete: ${downloadFilePath}`);

    const originalVideo = path.resolve(downloadFilePath);

    console.log("Starting transcoding...");

    const outputDir = path.join(__dirname, "transcoded");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    // Start the transcoder
    const promises = RESOLUTIONS.map((resolution) => {
      const output = path.join(
        outputDir,
        `${inputVideoName}-${resolution.name}${inputVideoExtension}`
      );

      return new Promise((resolve, reject) => {
        console.log(
          `Transcoding to ${resolution.name} with output file: ${output}`
        );

        ffmpeg(originalVideo)
          .output(output)
          .withVideoCodec("libx264")
          .withAudioCodec("aac")
          .withSize(`${resolution.width}x${resolution.height}`)
          .on("end", async () => {
            console.log(`Video transcoded to ${resolution.name}`);

            const outputContainerClient =
              blobServiceClient.getContainerClient(OUTPUT_VIDEO_BUCKET);
            const blobName = path.basename(output); // Use the file name as the blob name
            const blockBlobClient =
              outputContainerClient.getBlockBlobClient(blobName);
            transcodedVideo.push({
              name: blobName,
              url: blockBlobClient.url,
              resolution: resolution.name,
            });
            console.log(`Uploading transcoded video to blob: ${blobName}`);
            try {
              await blockBlobClient.uploadFile(output);
              console.log(`Uploaded to Azure Storage: ${blobName}`);
              resolve();
            } catch (uploadError) {
              console.error(`Error uploading ${blobName}:`, uploadError);
              reject(uploadError);
            }
          })
          .on("error", (error) => {
            console.error(
              `Error transcoding video to ${resolution.name}:`,
              error
            );
            reject(error);
          })
          .format("mp4")
          .run();
      });
    });

    await Promise.all(promises);

    console.log("All videos transcoded and uploaded to Azure Storage");
    console.log("Transcoding complete", transcodedVideo);
    await sendWebhook({
      success: true,
      message: "All videos transcoded and uploaded to Azure Storage",
      data: {
        transcodedVideo,
        uniqueId: uniqueid,
      },
    });
  } catch (error) {
    console.error("Error during video processing:", error);
    await sendWebhook({
      success: false,
      message: `Error during video processing: ${error.message}`,
      data: {
        transcodedVideo: [],
        uniqueId: uniqueid,
      },
    });
  } finally {
    process.exit(0);
  }
}

init();
