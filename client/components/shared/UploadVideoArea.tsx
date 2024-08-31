"use client";
import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CloudUploadIcon, X } from "lucide-react";
import axios from "axios";

const UploadVideoArea = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoResolution, setVideoResolution] = useState<string | null>(null);
  const [videoName, setVideoName] = useState<string | null>(null);
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { video: ["mp4", "avi", "mkv"] },
    multiple: false,
    disabled: videoFile !== null,
  });

  const submitVideo = async () => {
    const formData = new FormData();
    formData.append("video", videoFile as File);
    formData.append("videoName", videoName as string);
    formData.append("resolution", videoResolution as string);

    // Make a POST request to the server with the form data
    const response = await axios.post("/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response.data);
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
          <Button className="bg-blue-600 text-white" onClick={submitVideo}>
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
      </CardContent>
    </Card>
  );
};

export default UploadVideoArea;
