import { getProgress } from "@/utils/progress";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const videoId = req.nextUrl.searchParams.get("videoId");

  if (!videoId) {
    return NextResponse.json({ error: "Missing videoId" }, { status: 400 });
  }

  const stream = new ReadableStream({
    start(controller) {
      (async function () {
        while (true) {
          const progress = getProgress(videoId);
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
