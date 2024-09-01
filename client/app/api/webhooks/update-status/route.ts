import { UpdateStatusWebhookBody } from "@/interface";
import { createAndLinkTranscodedVideos } from "@/lib/action/video.action";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("Parsing the request body");
  const { success, message, data }: UpdateStatusWebhookBody = await req.json();

  if (!success || !message || !data) {
    console.log("Invalid request body");
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 }
    );
  }
  const { uniqueId, transcodedVideo } = data;
  if (!uniqueId || !transcodedVideo) {
    console.log("Invalid data in request body");
    return NextResponse.json(
      { message: "Invalid data in request body" },
      { status: 400 }
    );
  }
  console.log(
    `Received status update: ${success} for ${uniqueId} - ${message}`
  );
  const response = createAndLinkTranscodedVideos(
    uniqueId,
    success ? "FINISHED" : "FAILED",
    transcodedVideo
  );

  if (!response) {
    console.log("Failed to update status");
    return NextResponse.json(
      { message: "Failed to update status" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Status updated" }, { status: 200 });
}
