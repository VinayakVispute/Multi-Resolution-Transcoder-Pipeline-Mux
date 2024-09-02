"use client";

import { useState } from "react";
import { VideoResolutionOptionProps } from "@/interface";
import Link from "next/link";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import VideoPlayer from "./VideoPlayer";
import { Eye } from "lucide-react";
import { Video } from "@prisma/client";

const VideoResolutionOption = ({ videoDetails }: { videoDetails: Video }) => {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  return (
    <div>
      <div className="text-sm font-medium">{videoDetails.resolution}</div>
      <div className="flex items-center gap-2">
        <Link
          href={videoDetails.videoUrl}
          className="text-sm text-muted-foreground"
          prefetch={false}
        >
          Download
        </Link>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              <span>View</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px]">
            <VideoPlayer
              isVideoLoaded={isVideoLoaded}
              setIsVideoLoaded={setIsVideoLoaded}
              setIsShareOpen={setIsShareOpen}
              videoDetails={videoDetails}
            />
          </DialogContent>
          <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <h2 className="text-xl font-semibold mb-4">Share Video</h2>
              <div className="flex flex-col space-y-2">
                <input
                  type="text"
                  value={videoDetails.videoUrl}
                  readOnly
                  className="w-full p-2 border rounded"
                />
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(videoDetails.videoUrl);
                    setIsShareOpen(false);
                  }}
                >
                  Copy Link
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </Dialog>
      </div>
    </div>
  );
};

export default VideoResolutionOption;
