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
import { uploadToVercelStorage } from "@/lib/vercelBlob";

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

  const isVideoResolutionDecodable = (resolution: string) => {
    if (resolution === "720p" || resolution === "1080p" || resolution === "4K") {
      console.log(true)
      return true;
    }
    console.log(false)
    return false;
  }

  const submitVideo = async () => {
    if (!videoFile || !videoName || !videoResolution) {
      toast.error("Please fill in all the fields");
      return;
    }
    if (!isVideoResolutionDecodable(videoResolution)) {
      toast.error("Please upload a video with 720p, 1080p, or 4K resolution");
      return;
    }




    setLoading(true);
    const toastId = toast.custom(
      (t) => (
        <div
          className={`${t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-[#e6fcf5] shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-[#0ca678] ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <svg
                  className="h-10 w-10 text-[#0ca678] animate-spin"
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
                <p className="text-sm font-medium text-[#0ca678]">Loading...</p>
                <p className="mt-1 text-sm text-[#12b886]">
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
      // Upload video to Vercel Blob

      const vercelUploadResponse = await uploadToVercelStorage(videoFile);
      if (!vercelUploadResponse.success || !vercelUploadResponse.data?.url) {
        throw new Error("Failed to upload to Vercel Blob");
      }
      const videoId = `${Date.now()}-${videoName}`;
      setVideoId(videoId);
      const formData = new FormData();
      formData.append("videoUrl", vercelUploadResponse.data.url); // Use Vercel Blob URL
      formData.append("videoName", videoName);
      formData.append("resolution", videoResolution);
      formData.append("videoId", videoId);




      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      toast.custom(
        (t) => (
          <div
            className={`${t.visible ? "animate-enter" : "animate-leave"
              } max-w-md w-full bg-[#e6fcf5] shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-[#0ca678] ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <svg
                    className="h-10 w-10 text-[#0ca678]"
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
                      d="M9 12l2 2l4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-[#0ca678]">Success!</p>
                  <p className="mt-1 text-sm text-[#12b886]">
                    Video Uploaded Successfully
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-[#0ca678]">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-[#0ca678] hover:text-[#12b886] focus:outline-none focus:ring-2 focus:ring-[#0ca678]"
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
            className={`${t.visible ? "animate-enter" : "animate-leave"
              } max-w-md w-full bg-[#fff5f5] shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-[#ff6b6b] ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <svg
                    className="h-10 w-10 text-[#ff6b6b]"
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
                  <p className="text-sm font-medium text-[#ff6b6b]">Error!</p>
                  <p className="mt-1 text-sm text-[#fa5252]">
                    There was an error uploading your video.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-[#ff6b6b]">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-[#ff6b6b] hover:text-[#fa5252] focus:outline-none focus:ring-2 focus:ring-[#ff6b6b]"
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
      setVideoFile(null);
      setVideoPreview(null);
      setVideoResolution(null);
      setVideoName(null);
      setTimeout(() => {
        setPercentage(0);
      }, 5000); // Reset the progress bar after 5 seconds
    }
  };

  return (
    <Card className="bg-white border border-[#0ca678]">
      <CardHeader className="bg-[#0ca678]">
        <CardTitle className="text-white">Upload a Video</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 bg-white p-6">
        <div
          {...getRootProps()}
          className={`relative flex items-center justify-center border-2 border-dashed rounded-lg p-8 transition-colors ${isDragActive ? "border-[#0ca678]" : "border-[#12b886]"
            }`}
        >
          <input {...getInputProps()} />
          {!videoPreview ? (
            <div className="text-center flex flex-col gap-y-4 justify-center items-center">
              <CloudUploadIcon className="w-12 h-12 text-[#12b886]" />
              <div className="text-[#0ca678] font-medium">Drag and drop your video here</div>
              <div className="text-sm text-[#12b886]">
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
                className="absolute top-2 right-2 p-1 bg-[#0ca678] bg-opacity-50 rounded-full hover:bg-opacity-75 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          )}
        </div>
        {videoResolution && (
          <div className="text-[#0ca678] font-medium">Video Quality: {videoResolution}</div>
        )}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="video-name" className="text-[#0ca678]">
              Video Name
            </Label>
            <Input
              id="video-name"
              placeholder="Enter video name"
              className="border-[#12b886] text-[#0ca678]"
              disabled={!videoFile}
              value={videoName || ""}
              onChange={(e) => setVideoName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="video-resolution" className="text-[#0ca678]">
              Video Resolution (Current Video)
            </Label>
            <Input
              id="video-resolution"
              value={videoResolution || "N/A"}
              className="border-[#12b886] text-[#0ca678] bg-white"
              readOnly
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            className="bg-[#0ca678] text-white hover:bg-[#12b886]"
            onClick={submitVideo}
            disabled={!videoFile || loading}
          >
            Upload
          </Button>
          <Button
            variant="outline"
            className="border-[#12b886] text-[#0ca678] hover:bg-[#e6fcf5]"
            onClick={removeVideo}
          >
            Clear
          </Button>
        </div>
        {loading && (
          <div className="mt-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-base font-medium text-[#0ca678]">
                  Upload
                </span>
                <span className="text-sm font-medium text-[#0ca678]">
                  {percentage}%
                </span>
              </div>
              <div className="w-full bg-[#e6fcf5] rounded-full h-2.5">
                <div
                  className="bg-[#0ca678] h-2.5 rounded-full"
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