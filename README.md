# Multi-Resolution-Transcoder-Pipeline | Mux

A scalable video transcoding pipeline designed to convert videos into multiple resolutions, leveraging Azure's powerful cloud services. This project is inspired by Mux and demonstrates how to build a video processing pipeline that can be easily scaled to handle large volumes of videos.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Azure Services Used](#azure-services-used)
- [Pipeline Workflow](#pipeline-workflow)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Overview

This project automates the process of transcoding videos into multiple resolutions using Azure services. The pipeline downloads a video from Azure Blob Storage, transcodes it into different resolutions (360p, 480p, 720p), and uploads the transcoded videos back to Azure Blob Storage with a suffix indicating the resolution. This allows for easy selection of videos based on desired resolution.

> Why settle for one resolution when you can have them all? Transcode like a ninja!✨

## Tech Stack

- **Node.js**: The runtime environment used to execute JavaScript code on the server side.
- **TypeScript**: Superset of JavaScript used for type safety and improved developer experience.
- **Fluent-ffmpeg**: A Node.js library for working with FFmpeg, used here for video transcoding.
- **Azure SDK for JavaScript**: Used for interacting with various Azure services.

## Azure Services Used

### 1. **Azure Blob Storage**

- **Purpose**: Used for storing the original video files and the transcoded videos.
- **Role**: The pipeline retrieves the input video from a specified container, processes it, and stores the output videos back in another container.

### 2. **Azure Storage Queue**

- **Purpose**: Used for queuing video processing requests.
- **Role**: The pipeline listens to the queue, retrieves messages, and processes videos accordingly. This allows for asynchronous processing and easy scaling.

### 3. **Azure Container Instances**

- **Purpose**: Provides a platform for running the containerized video transcoding service.
- **Role**: The pipeline spins up containers on demand to handle video transcoding, ensuring that resources are used efficiently.

### 4. **Azure Container Registry ACR**

- **Purpose**: Stores container images.
- **Role**: The pipeline pulls the Docker image from the registry to spin up container instances for video processing.

## Pipeline Workflow

![Workflow](https://res.cloudinary.com/dkawvablj/image/upload/v1724851239/VinayakVIspute/evwbhhtlbet661yyhnde.png)

1. **Message Queue**: The pipeline starts by receiving a message from an Azure Storage Queue, which contains the name of the video blob to be processed.

2. **Video Download**: The pipeline downloads the video from Azure Blob Storage.

3. **Video Transcoding**: The video is transcoded into multiple resolutions using `fluent-ffmpeg`.

4. **Video Upload**: The transcoded videos are uploaded back to Azure Blob Storage with filenames that include the resolution suffix (e.g., `video-360p.mp4`).

5. **Repeat**: The pipeline continues to listen to the queue for new messages, allowing for continuous processing.

## Setup and Installation

### Prerequisites

- **Node.js** and **npm/yarn** installed.
- Azure account with the following services set up:
  - Blob Storage containers (input and output)
  - Storage Queue
  - Container Registry with a Docker image for the transcoding service
  - Container Instance setup

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/VinayakVispute/Multi-Resolution-Transcoder-Pipeline-Mux.git
   cd Multi-Resolution-Transcoder-Pipeline-Mux
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and populate it with the following values:

   ```
   AZURE_STORAGE_CONNECTION_STRING=your_connection_string
   AZURE_RESOURCE_GROUP=your_resource_group
   AZURE_CONTAINER_REGISTRY_SERVER=your_registry_server
   CONTAINER_GROUP_NAME=your_container_group_name
   CONTAINER_NAME=your_container_name
   BUCKET_NAME=input_blob_container_name
   OUTPUT_VIDEO_BUCKET=output_blob_container_name
   SUBSCRIPTION_ID=your_subscription_id
   ACR_USERNAME=your_acr_username
   ACR_PASSWORD=your_acr_password
   QUEUE_NAME=your_queue_name
   RESOURCE_GROUP_LOCATION=location_for_resource_group
   ```

4. **Run the pipeline:**
   ```bash
   npm start
   ```

## Usage

- **Input**: The pipeline processes video files stored in an Azure Blob Storage container. The video file's name is extracted from a message received from an Azure Storage Queue.
- **Output**: The transcoded videos are stored in another Azure Blob Storage container with filenames suffixed with the resolution (e.g., `video-360p.mp4`, `video-480p.mp4`, `video-720p.mp4`).

## Contributing

Contributions are welcome! Please fork this repository, create a feature branch, and submit a pull request for any enhancements or fixes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

This README provides a comprehensive overview of your project, its components, and how to use it.
