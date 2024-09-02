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

// Set up Express and HTTP server

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function decodedMessageText(messageText: string) {
  try {
    const response = Buffer.from(messageText, "base64").toString("utf-8");
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
    console.log(
      `Container group: ${containerGroupName} - Status: ${containerGroup.containers[0].instanceView?.currentState?.state}`
    );
    return containerGroup;
  } catch (error: any) {
    if (error.statusCode === 404) {
      console.log(`Container group ${containerGroupName} not found.`);
      return null;
    }
    console.error("Error checking container group status:", error);
    throw error;
  }
}

async function spinUpContainer(
  blobName: string,
  containerSuffix: string,
  containerCounter: number,
  messageId: string,
  popReceipt: string
) {
  const containerGroupName = `${CONTAINER_GROUP_NAME}-${containerSuffix}`;
  try {
    const existingContainerGroup = await checkContainerGroupStatus(
      containerGroupName
    );

    if (
      existingContainerGroup &&
      (existingContainerGroup.containers[0].instanceView?.currentState
        ?.state === "Running" ||
        existingContainerGroup.containers[0].instanceView?.currentState
          ?.state === "Waiting")
    ) {
      console.log(`Container group ${containerGroupName} is already running.`);
      return;
    }

    if (
      existingContainerGroup &&
      existingContainerGroup.containers[0].instanceView?.currentState?.state ===
        "Terminated"
    ) {
      console.log(
        `Container group ${CONTAINER_NAME}-${containerCounter} has terminated. Restarting...`
      );
    } else {
      console.log(
        `Starting container group: ${CONTAINER_NAME}-${containerCounter}`
      );
    }
    if (!AZURE_RESOURCE_GROUP) {
      console.error("Resource group is not defined");
      throw new Error("Resource group is not defined");
    }

    const containerGroup =
      await client.containerGroups.beginCreateOrUpdateAndWait(
        AZURE_RESOURCE_GROUP,
        containerGroupName,
        {
          location: "eastus",
          osType: "Linux",
          containers: [
            {
              name:
                `${CONTAINER_NAME}-${containerCounter}` || "video-processor",
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
                {
                  name: "WEBHOOK_URL",
                },
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

    console.log(`Container instance started: ${containerGroupName}`);

    // Delete the message from the queue after the container has started successfully
    try {
      await queueClient.deleteMessage(messageId, popReceipt);
      console.log("Message deleted from the queue.");
    } catch (error) {
      console.error("Error deleting message from the queue:", error);
    }
  } catch (error) {
    console.error("Error starting the container:", error);

    throw error;
  }
}

async function init() {
  let containerCounter = 5;
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
        console.log("Queue is empty.");
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

        await spinUpContainer(
          blobName,
          "instance",
          containerCounter,
          messageId,
          popReceipt
        );
        console.log("Container processed the blob.");
        containerCounter++;
      } else {
        console.log("Message does not match expected format.");
      }

      await delay(20000);
    } catch (error) {
      console.error("Error processing queue message:", error);
      await delay(20000);
    }
  }
}

init().catch((err) => {
  console.error("Error running the process:", err);
});
