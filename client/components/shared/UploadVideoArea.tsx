"use client";
import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CloudUploadIcon, X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const UploadVideoArea = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoResolution, setVideoResolution] = useState<string | null>(null);
  const [videoName, setVideoName] = useState<string | null>(null);
  const [percentage, setPercentage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      setVideoName(file.name);
    }
  }, []);

  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreview(null);
    setVideoResolution(null);
    setVideoName(null);
  };

  useEffect(() => {
    if (videoPreview) {
      const video = document.createElement("video");
      video.src = videoPreview;

      video.addEventListener("loadedmetadata", () => {
        const { videoWidth, videoHeight } = video;

        let quality = "Unknown";
        if (videoWidth < 640 && videoHeight < 360) {
          quality = "Less than 360p";
        } else if (videoWidth === 640 && videoHeight === 360) {
          quality = "360p";
        } else if (videoWidth === 854 && videoHeight === 480) {
          quality = "480p";
        } else if (videoWidth === 1280 && videoHeight === 720) {
          quality = "720p";
        } else if (videoWidth === 1920 && videoHeight === 1080) {
          quality = "1080p";
        } else if (videoWidth === 3840 && videoHeight === 2160) {
          quality = "4K";
        } else if (videoWidth > 3840 && videoHeight > 2160) {
          quality = "More than 4K";
        }

        setVideoResolution(quality);
      });
    }
  }, [videoPreview]);

  useEffect(() => {
    if (videoId) {
      const eventSource = new EventSource(`/api/progress?videoId=${videoId}`);
      console.log("Event source created");
      eventSource.onmessage = (event) => {
        const { progress } = JSON.parse(event.data);
        setPercentage(progress);
        if (progress === 100) {
          console.log("Upload complete, closing EventSource");
          eventSource.close();
        } else if (progress === -1) {
          console.error("Upload failed, closing EventSource");
          eventSource.close();
          //can show alert
        }
      };

      eventSource.onerror = (error) => {
        console.error("EventSource error:", error);
        eventSource.close();
      };

      return () => {
        eventSource.close();
      };
    }
  }, [videoId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/mp4": [".mp4"],
      "video/x-matroska": [".mkv"],
    },
    multiple: false,
    disabled: videoFile !== null,
  });

  const submitVideo = async () => {
    const videoId = `${Date.now()}-${videoName}`;

    const formData = new FormData();
    formData.append("video", videoFile as File);
    formData.append("videoName", videoName as string);
    formData.append("resolution", videoResolution as string);
    formData.append("videoId", videoId);
    setVideoId(videoId);

    setLoading(true);
    const toastId = toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-blue-100 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <svg
                  className="h-10 w-10 text-blue-500 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-blue-900">Loading...</p>
                <p className="mt-1 text-sm text-blue-700">
                  Please wait while we process your request.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        duration: 30000,
      }
    );
    try {
      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-green-100 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <svg
                    className="h-10 w-10 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2l4-4m0 0a9 9 0 11-6.364-2.636A9 9 0 0112 21a9 9 0 01-9-9a9 9 0 019-9a9 9 0 019 9z"
                    />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-green-900">Success!</p>
                  <p className="mt-1 text-sm text-green-700">
                    Video Uploaded Successfully
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-green-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-green-600 hover:text-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Close
              </button>
            </div>
          </div>
        ),
        {
          id: toastId,
          duration: 3000,
        }
      );
    } catch (error) {
      console.error(error);
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-red-100 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <svg
                    className="h-10 w-10 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-red-900">Error!</p>
                  <p className="mt-1 text-sm text-red-700">
                    There was an error uploading your video.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-red-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-red-600 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Close
              </button>
            </div>
          </div>
        ),
        {
          id: toastId,
          duration: 3000,
        }
      );
    } finally {
      setLoading(false);
      setTimeout(() => {
        setPercentage(0);
      }, 5000); // Reset the progress bar after 5 seconds
    }
  };

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader className="bg-white">
        <CardTitle className="text-black">Upload a Video</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 bg-white">
        <div
          {...getRootProps()}
          className={`relative flex items-center justify-center border-2 border-dashed rounded-lg p-8 transition-colors ${
            isDragActive ? "border-blue-600" : "border-gray-800"
          }`}
        >
          <input {...getInputProps()} />
          {!videoPreview ? (
            <div className="text-center flex flex-col gap-y-4 justify-center items-center">
              <CloudUploadIcon className="w-8 h-8 text-gray-500" />
              <div className="text-black">Drag and drop your video here</div>
              <div className="text-sm text-gray-500">
                or click to select a file
              </div>
            </div>
          ) : (
            <div className="relative">
              <video
                src={videoPreview}
                className="max-h-40 rounded-lg"
                controls
              />
              <button
                onClick={removeVideo}
                className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          )}
        </div>
        {videoResolution && (
          <div className="text-black">Video Quality: {videoResolution}</div>
        )}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="video-name" className="text-black">
              Video Name
            </Label>
            <Input
              id="video-name"
              placeholder="Enter video name"
              className="border-gray-800 text-black"
              style={{
                backgroundColor: "white",
              }}
              disabled={!videoFile}
              value={videoName || ""}
              onChange={(e) => setVideoName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="video-resolution" className="text-black">
              Video Resolution (Current Video)
            </label>
            <Input
              id="video-resolution"
              value={videoResolution || "N/A"}
              className="border-gray-800 text-black bg-white"
              readOnly
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            className="bg-blue-600 text-white"
            onClick={submitVideo}
            disabled={!videoFile || loading}
          >
            Upload
          </Button>
          <Button
            variant="outline"
            className="border-gray-300 text-black"
            onClick={removeVideo}
          >
            Clear
          </Button>
        </div>
        {loading && (
          <div className="mt-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-base font-medium text-blue-700 dark:text-white">
                  Upload
                </span>
                <span className="text-sm font-medium text-blue-700 dark:text-white">
                  {percentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{
                    width: `${percentage}%`,
                    transition: "width 0.5s ease-in-out",
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UploadVideoArea;
