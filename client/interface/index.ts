export interface createUploadVideoInDbParams {
  id: string;
  title: string;
  videoUrl: string;
  resolution: string;
}

enum Status {
  Success = "FINISHED",
  Pending = "PENDING",
  Failed = "FAILED",
}

interface Video {
  id: number;
  title: string;
  videoUrl: string;
  uploadedAt: Date;
  resolution: string;
}

export interface UploadedVideo {
  id: number;
  userId: number;
  status: Status;
  videoId: number;
  uploadedAt: Date;
  createdAt: Date;
  video: Video;
}

export interface VideoResolutionOptionProps {
  resolution: string;
}

export interface VideoDialogProps {
  video: UploadedVideo;
}

interface transcodedVideoWebhook {
  name: string;
  url: string;
  resolution: string;
}

export interface UpdateStatusWebhookBody {
  success: boolean;
  message: string;
  data: {
    uniqueId: string;
    transcodedVideo: transcodedVideoWebhook[] | [];
  };
}
