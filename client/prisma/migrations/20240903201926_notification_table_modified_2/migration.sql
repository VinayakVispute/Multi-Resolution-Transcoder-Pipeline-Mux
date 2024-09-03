/*
  Warnings:

  - You are about to drop the column `uploadedVideoName` on the `Notifications` table. All the data in the column will be lost.
  - Added the required column `uploadedVideoId` to the `Notifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notifications" DROP COLUMN "uploadedVideoName",
ADD COLUMN     "uploadedVideoId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_uploadedVideoId_fkey" FOREIGN KEY ("uploadedVideoId") REFERENCES "UploadedVideo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
