let progressMap = new Map<string, number>();

export function getProgress(videoId: string): number {
  return progressMap.get(videoId) || 0;
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
