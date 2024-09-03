"use client";

import { Button } from "@/components/ui/button"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { RefreshCw, FileDown, Eye } from "lucide-react"
import { fetchUploadedVideos } from "@/lib/action/video.action"
import { UploadedVideo, VideoDialogProps } from "@/interface"
import { statusColor } from "@/lib/utils"
import VideoResolutionOption from "@/components/shared/VideoResolutionOption"
import { useEffect, useState } from "react";

const VideoDialog = ({ TranscodedVideos, VideoDetails }: VideoDialogProps) => {
  return (
    <DialogContent className="sm:max-w-[800px] bg-gradient-to-br from-[#e6fcf5] to-white">
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-lg font-medium text-[#0ca678]">{VideoDetails.video.title}</div>
            <div className="text-sm text-[#12b886]">
              Transcoded at: {new Date(VideoDetails.uploadedAt).toLocaleString()}
            </div>
          </div>
          <Badge variant="secondary" className={`${statusColor[VideoDetails.status]} shadow-md`}>
            {VideoDetails.status}
          </Badge>
        </div>
        <div className="grid gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
          <Button type="button" className="bg-[#0ca678] text-white hover:bg-[#12b886] transition-all hover:scale-105">Close</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}

export default function History() {
  const [videoData, setVideoData] = useState<{ uploadedVideos: UploadedVideo[] } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)



  const fetchVideos = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetchUploadedVideos()
      if (!response.success) {
        console.error(response.message)
        setError(response.message)
        return;
      }
      setVideoData({ uploadedVideos: response.data })
    } catch (error: any) {
      console.error(error.message)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {

    fetchVideos()
  }, [])



  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#0ca678] to-[#12b886]">
        <div className="text-white text-2xl font-bold animate-pulse">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#0ca678] to-[#12b886]">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Failed to fetch videos</h2>
          <p className="text-lg">{error}</p>
        </div>
      </div>
    )
  }

  if (!videoData || videoData.uploadedVideos.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#0ca678] to-[#12b886]">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">No videos uploaded yet</h2>
          <p className="text-lg">Upload a video to see it here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#e6fcf5]">
      <header className="bg-gradient-to-r from-[#0ca678] to-[#12b886] text-white px-6 py-8 shadow-lg">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-4">Video Processing History</h2>
          <div className="flex items-center gap-4">
            <Button variant="secondary" size="lg" className="bg-white text-[#0ca678] hover:bg-[#e6fcf5] transition-all hover:scale-105">
              <FileDown className="h-5 w-5 mr-2" />
              <span>Export</span>
            </Button>
            <Button variant="secondary" size="lg" className="bg-white text-[#0ca678] hover:bg-[#e6fcf5] transition-all hover:scale-105" onClick={fetchVideos}>
              <RefreshCw className="h-5 w-5 mr-2" />
              <span>Refresh</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 p-6 md:p-10">
        <div className="container mx-auto bg-white rounded-xl shadow-2xl overflow-hidden transition-all hover:shadow-3xl">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#0ca678] text-white">
                <TableHead className="font-bold">Sr. No.</TableHead>
                <TableHead className="font-bold">Title</TableHead>
                <TableHead className="font-bold">Uploaded At</TableHead>
                <TableHead className="font-bold">Resolution</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videoData.uploadedVideos.map((video, index) => (
                <TableRow key={video.id} className="hover:bg-[#e6fcf5] transition-colors">
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">{video.video.title}</TableCell>
                  <TableCell>{new Date(video.video.uploadedAt).toLocaleString()}</TableCell>
                  <TableCell>{video.video.resolution}</TableCell>
                  <TableCell>
                    <Badge className={`${statusColor[video.status]} shadow-md`}>
                      {video.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={video.status !== "FINISHED"}
                          className="bg-[#0ca678] text-white hover:bg-[#12b886] transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                        >
                          <Eye className="h-4 w-4 mr-2" />
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
      </main>
      <footer className="bg-[#0ca678] py-6 px-4 md:px-6 text-white">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Video Processing. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}