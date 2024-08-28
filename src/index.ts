import { QueueClient, QueueReceiveMessageResponse } from "@azure/storage-queue";
import * as dotenv from "dotenv";
import { DequeuedMessageItem } from "@azure/storage-queue";
import {
  ContainerInstanceManagementClient,
  ContainerGroup,
} from "@azure/arm-containerinstance";
import { DefaultAzureCredential } from "@azure/identity";

// Load environment variables from .env file
dotenv.config();

const AZURE_STORAGE_CONNECTION_STRING =
  process.env.AZURE_STORAGE_CONNECTION_STRING;
const AZURE_RESOURCE_GROUP = process.env.AZURE_RESOURCE_GROUP;
const AZURE_CONTAINER_REGISTRY_SERVER =
  process.env.AZURE_CONTAINER_REGISTRY_SERVER;
const CONTAINER_GROUP_NAME = process.env.CONTAINER_GROUP_NAME;
const CONTAINER_NAME = process.env.CONTAINER_NAME;
const BUCKET_NAME = process.env.BUCKET_NAME;
const OUTPUT_VIDEO_BUCKET = process.env.OUTPUT_VIDEO_BUCKET;
const SUBSCRIPTION_ID = process.env.SUBSCRIPTION_ID;
const ACR_USERNAME = process.env.ACR_USERNAME;
const ACR_PASSWORD = process.env.ACR_PASSWORD;
const QUEUE_NAME = process.env.QUEUE_NAME;

if (
  !AZURE_STORAGE_CONNECTION_STRING ||
  !AZURE_RESOURCE_GROUP ||
  !CONTAINER_GROUP_NAME ||
  !AZURE_CONTAINER_REGISTRY_SERVER ||
  !CONTAINER_NAME ||
  !BUCKET_NAME ||
  !OUTPUT_VIDEO_BUCKET ||
  !SUBSCRIPTION_ID ||
  !ACR_USERNAME ||
  !ACR_PASSWORD ||
  !QUEUE_NAME
) {
  throw new Error("Required environment variables are missing.");
}

const queueClient = new QueueClient(
  AZURE_STORAGE_CONNECTION_STRING,
  QUEUE_NAME
);
const client = new ContainerInstanceManagementClient(
  new DefaultAzureCredential(),
  SUBSCRIPTION_ID
);

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function decodedMessageText(messageText: string) {
  try {
    const response = Buffer.from(messageText, "base64").toString("utf-8");
    console.log("decodedMessageText =>", response);
    return JSON.parse(response);
  } catch (error) {
    console.error("Failed to decode message text:", error);
    throw error;
  }
}

async function checkContainerGroupStatus(
  containerGroupName: string
): Promise<ContainerGroup | null> {
  try {
    const containerGroup = await client.containerGroups.get(
      AZURE_RESOURCE_GROUP || "",
      containerGroupName
    );
    console.log(`Container group status: ${containerGroup.provisioningState}`);
    return containerGroup;
  } catch (error: any) {
    if (error.statusCode === 404) {
      console.log("Container group not found, it may not exist.");
      return null;
    }
    console.error("Error checking container group status:", error);
    throw error;
  }
}

async function spinUpContainer(blobName: string, containerSuffix: string) {
  try {
    const containerGroupName = `${CONTAINER_GROUP_NAME}-${containerSuffix}`;
    const existingContainerGroup = await checkContainerGroupStatus(
      containerGroupName
    );

    if (
      existingContainerGroup &&
      existingContainerGroup.provisioningState === "Succeeded"
    ) {
      console.log(`Container group ${containerGroupName} is already running.`);
      return;
    }

    console.log(
      `Spinning up the Azure Container Instance: ${containerGroupName}`
    );

    const containerGroup =
      await client.containerGroups.beginCreateOrUpdateAndWait(
        AZURE_RESOURCE_GROUP || "",
        containerGroupName || "",
        {
          location: "eastus",
          osType: "Linux",
          containers: [
            {
              name: CONTAINER_NAME || "video-processor",
              image: `${AZURE_CONTAINER_REGISTRY_SERVER}/${CONTAINER_NAME}:latest`,
              resources: {
                requests: {
                  cpu: 2,
                  memoryInGB: 4,
                },
              },
              environmentVariables: [
                {
                  name: "AZURE_STORAGE_CONNECTION_STRING",
                  value: AZURE_STORAGE_CONNECTION_STRING,
                },
                { name: "BUCKET_NAME", value: BUCKET_NAME },
                { name: "INPUT_VIDEO", value: blobName },
                { name: "OUTPUT_VIDEO_BUCKET", value: OUTPUT_VIDEO_BUCKET },
              ],
            },
          ],
          imageRegistryCredentials: [
            {
              server: AZURE_CONTAINER_REGISTRY_SERVER || "",
              username: ACR_USERNAME,
              password: ACR_PASSWORD,
            },
          ],
          restartPolicy: "OnFailure",
        }
      );

    console.log("Container Instance started:", containerGroup);
  } catch (error) {
    console.error("Error spinning up the container:", error);
    throw error;
  }
}

async function init() {
  let containerCounter = 1;

  while (true) {
    try {
      const response: QueueReceiveMessageResponse =
        await queueClient.receiveMessages({
          numberOfMessages: 1,
          visibilityTimeout: 60,
        });

      const {
        receivedMessageItems,
      }: { receivedMessageItems: DequeuedMessageItem[] } = response;

      if (receivedMessageItems.length === 0) {
        console.log("No messages found in the queue");
        await delay(20000);
        continue;
      }

      const { messageText, messageId, popReceipt }: DequeuedMessageItem =
        receivedMessageItems[0];
      const { eventType, subject } = decodedMessageText(messageText);

      if (
        eventType === "Microsoft.Storage.BlobCreated" &&
        subject &&
        messageText
      ) {
        const subjectParts = subject.split("/");
        const blobName = subjectParts.slice(6).join("/");

        await spinUpContainer(blobName, `instance-${containerCounter}`);
        console.log("Container spun up successfully");
        containerCounter++;
      } else {
        console.log("Invalid event type or subject:", eventType, subject);
      }

      try {
        const deleteResponse = await queueClient.deleteMessage(
          messageId,
          popReceipt
        );
        console.log("Deleted message from the queue:", deleteResponse);
      } catch (error) {
        console.error("Error deleting message from the queue:", error);
      }

      await delay(20000);
    } catch (error) {
      console.error("Error receiving messages:", error);
      await delay(20000);
    }
  }
}

init().catch((err) => {
  console.error("Error running the sample:", err);
});
