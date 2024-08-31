import { NextRequest, NextResponse } from "next/server";

let progressMap = new Map<string, number>();

export async function GET(req: NextRequest) {
  const videoId = req.nextUrl.searchParams.get("videoId");

  if (!videoId) {
    return NextResponse.json({ error: "Missing videoId" }, { status: 400 });
  }

  const stream = new ReadableStream({
    start(controller) {
      (async function () {
        console.log(
          "Starting progress stream for video",
          progressMap.get(videoId)
        );
        while (true) {
          const progress = progressMap.get(videoId) || 0;
          controller.enqueue(`data: ${JSON.stringify({ progress })}\n\n`);
          if (progress === 100 || progress === -1) {
            console.log("Upload complete, closing stream");
            controller.close();
            break;
          }
          await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second
        }
      })();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Transfer-Encoding": "chunked",
    },
  });
}

export function updateProgress(videoId: string, progress: number) {
  console.log("Updating progress for video", videoId, "to", progress);
  progressMap.set(videoId, progress);
  if (progress === 100 || progress === -1) {
    // Optionally, you can remove the entry from the map once it's complete
    setTimeout(() => {
      progressMap.delete(videoId);
    }, 5000); // Remove the entry after 5 seconds
  }
}
