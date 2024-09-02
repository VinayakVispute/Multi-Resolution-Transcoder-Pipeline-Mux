import { lazy, Suspense } from "react";
import { Button } from "../ui/button";
import { Download, Share2 } from "lucide-react";
import { Video } from "@prisma/client";
const ReactPlayer = lazy(() => import("react-player/lazy"));

function VideoSkeleton() {
  return (
    <div className="aspect-video bg-gray-200 animate-pulse flex items-center justify-center">
      <svg
        className="w-12 h-12 text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        fill="currentColor"
        viewBox="0 0 640 512"
      >
        <path d="M64 64V352H576V64H64zM0 64C0 28.7 28.7 0 64 0H576c35.3 0 64 28.7 64 64V352c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zM128 448H512c17.7 0 32 14.3 32 32s-14.3 32-32 32H128c-17.7 0-32-14.3-32-32s14.3-32 32-32z" />
      </svg>
    </div>
  );
}

const VideoPlayer = ({
  isVideoLoaded,
  setIsVideoLoaded,
  setIsShareOpen,
  videoDetails,
}: {
  isVideoLoaded: boolean;
  setIsVideoLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  setIsShareOpen: React.Dispatch<React.SetStateAction<boolean>>;
  videoDetails: Video
}) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = videoDetails.videoUrl;
    link.download = "video.mp4";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-2xl font-bold">{videoDetails.title}</h2>
      <div className="aspect-video">
        <Suspense fallback={<VideoSkeleton />}>
          {!isVideoLoaded && <VideoSkeleton />}
          <ReactPlayer
            url={videoDetails.videoUrl}
            width="100%"
            height="100%"
            controls
            onReady={() => setIsVideoLoaded(true)}
            style={{ display: isVideoLoaded ? "block" : "none" }}
          />
        </Suspense>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Resolution: {videoDetails.resolution}
        </span>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsShareOpen(true)}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
