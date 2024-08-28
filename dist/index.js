"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const storage_queue_1 = require("@azure/storage-queue");
const dotenv = __importStar(require("dotenv"));
const arm_containerinstance_1 = require("@azure/arm-containerinstance");
const identity_1 = require("@azure/identity");
// Load environment variables from .env file
dotenv.config();
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const AZURE_RESOURCE_GROUP = process.env.AZURE_RESOURCE_GROUP;
const AZURE_CONTAINER_REGISTRY_SERVER = process.env.AZURE_CONTAINER_REGISTRY_SERVER;
const CONTAINER_GROUP_NAME = process.env.CONTAINER_GROUP_NAME;
const CONTAINER_NAME = process.env.CONTAINER_NAME;
const BUCKET_NAME = process.env.BUCKET_NAME;
const OUTPUT_VIDEO_BUCKET = process.env.OUTPUT_VIDEO_BUCKET;
const SUBSCRIPTION_ID = process.env.SUBSCRIPTION_ID;
const ACR_USERNAME = process.env.ACR_USERNAME;
const ACR_PASSWORD = process.env.ACR_PASSWORD;
const queueName = "temprawvideos-queue";
if (!AZURE_STORAGE_CONNECTION_STRING ||
    !AZURE_RESOURCE_GROUP ||
    !CONTAINER_GROUP_NAME ||
    !AZURE_CONTAINER_REGISTRY_SERVER ||
    !CONTAINER_NAME ||
    !BUCKET_NAME ||
    !OUTPUT_VIDEO_BUCKET ||
    !SUBSCRIPTION_ID ||
    !ACR_USERNAME ||
    !ACR_PASSWORD) {
    throw new Error("Required environment variables are missing. Please make sure you have the following environment variables set: AZURE_STORAGE_CONNECTION_STRING, AZURE_RESOURCE_GROUP, CONTAINER_GROUP_NAME, AZURE_CONTAINER_REGISTRY_SERVER, CONTAINER_NAME, BUCKET_NAME, OUTPUT_VIDEO_BUCKET");
}
const queueClient = new storage_queue_1.QueueClient(AZURE_STORAGE_CONNECTION_STRING, queueName);
const client = new arm_containerinstance_1.ContainerInstanceManagementClient(new identity_1.DefaultAzureCredential(), SUBSCRIPTION_ID);
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function decodedMessageText(messageText) {
    const response = Buffer.from(messageText, "base64").toString("utf-8");
    console.log("decodedMessageText =>", response);
    return JSON.parse(response);
}
function spinUpContainer(blobName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Spinning up the Azure Container Instance...");
            const containerGroup = yield client.containerGroups.beginCreateOrUpdateAndWait(AZURE_RESOURCE_GROUP || "", CONTAINER_GROUP_NAME || "", {
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
            });
            console.log("Container Instance started:", containerGroup);
        }
        catch (err) {
            console.error("Error spinning up the container:", err);
        }
    });
}
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        while (true) {
            try {
                const response = yield queueClient.receiveMessages({
                    numberOfMessages: 1,
                    visibilityTimeout: 60, // The message will be invisible for 60 seconds
                });
                const { receivedMessageItems, } = response;
                if (receivedMessageItems.length === 0) {
                    console.log("No messages found in the queue");
                    yield delay(20000); // Wait for 20 seconds before the next iteration
                    continue;
                }
                const { messageText, messageId, popReceipt } = receivedMessageItems[0];
                const { eventType, subject } = decodedMessageText(messageText);
                //validate the event
                if (eventType === "Microsoft.Storage.BlobCreated" &&
                    subject &&
                    messageText) {
                    const subjectParts = subject.split("/");
                    const containerName = subjectParts[4]; // "temp-videos"
                    const blobName = subjectParts.slice(6).join("/"); // "Untitled design.mp4"
                    yield spinUpContainer(blobName);
                    console.log("Container spun up successfully");
                }
                const deleteResponse = yield queueClient.deleteMessage(messageId, popReceipt);
                console.log("Deleted message from the queue:", deleteResponse);
                // Wait for 20 seconds before polling again
                yield delay(20000); // Wait for 20 seconds before the next iteration
            }
            catch (err) {
                console.error("Error receiving messages:", err);
                yield delay(20000); // Wait before retrying on error
            }
        }
    });
}
init().catch((err) => {
    console.error("Error running the sample:", err);
});
