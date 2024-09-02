import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { RefreshCw, Download, Eye, FileDown, VideoOff } from "lucide-react";
import { fetchUploadedVideos } from "@/lib/action/video.action";
import { UploadedVideo, VideoDialogProps } from "@/interface";
import { statusColor } from "@/lib/utils";
import VideoResolutionOption from "@/components/shared/VideoResolutionOption";



const VideoDialog = ({ TranscodedVideos, VideoDetails }: VideoDialogProps) => {



  return (
    <DialogContent className="sm:max-w-[800px]">
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-lg font-medium">{"video.video.title"}</div>
            <div className="text-sm text-muted-foreground">
              Transcoded at: {new Date(VideoDetails.uploadedAt).toLocaleString()}
            </div>
          </div>
          <Badge variant="secondary" className={statusColor[VideoDetails.status]}>
            {VideoDetails.status}
          </Badge>
        </div>
        <div className="grid gap-4">
          <div className="grid grid-cols-3 gap-4">
            {TranscodedVideos.map((singleTranscodedVideo) => (
              <VideoResolutionOption
                key={singleTranscodedVideo.id}
                videoDetails={singleTranscodedVideo.video}
              />
            ))}
          </div>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button">Close</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
};

export default async function History() {
  const response = await fetchUploadedVideos();

  if (!response.success) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-lg font-medium">Failed to fetch videos</h2>
          <p className="text-muted-foreground mt-2">{response.message}</p>
        </div>
      </div>
    );
  }
  const videoData = { uploadedVideos: response.data } as {
    uploadedVideos: UploadedVideo[];
  };

  if (videoData.uploadedVideos.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-lg font-medium">No videos uploaded yet</h2>
          <p className="text-muted-foreground mt-2">
            Upload a video to see it here
          </p>
        </div>
      </div>
    );
  }
  console.log("videoData", JSON.stringify(videoData, null, 2));
  return (
    <div className="flex flex-col w-full">
      <header className="bg-background border-b px-6 py-4 flex items-center justify-between">
        <h2 className="text-lg font-medium">History</h2>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            <FileDown className="h-4 w-4 mr-2" />
            <span>Export</span>
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            <span>Refresh</span>
          </Button>
        </div>
      </header>
      <div className="flex-1 p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sr. No.</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Uploaded At</TableHead>
              <TableHead>Resolution</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videoData.uploadedVideos.map((video, index) => (
              <TableRow key={video.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{video.video.title}</TableCell>
                <TableCell>
                  {new Date(video.video.uploadedAt).toLocaleString()}
                </TableCell>
                <TableCell>{video.video.resolution}</TableCell>
                <TableCell>
                  <span
                    className={`text-xs font-medium me-2 px-2.5 py-0.5 rounded ${statusColor[video.status]
                      }`}
                  >
                    {video.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={video.status !== "FINISHED"}
                      >
                        View Transcoded Video
                      </Button>
                    </DialogTrigger>
                    <VideoDialog
                      TranscodedVideos={video.TranscodedVideo}
                      VideoDetails={video}
                    />
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
