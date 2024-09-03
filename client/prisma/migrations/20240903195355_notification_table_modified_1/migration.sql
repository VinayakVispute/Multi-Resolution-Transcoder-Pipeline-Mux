/*
  Warnings:

  - You are about to drop the column `type` on the `Notifications` table. All the data in the column will be lost.
  - Added the required column `uploadedVideoName` to the `Notifications` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `event` on the `Notifications` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Event" AS ENUM ('NEW_VIDEO', 'TRANSCODED_VIDEO');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('FINISHED', 'FAILED');

-- AlterTable
ALTER TABLE "Notifications" DROP COLUMN "type",
ADD COLUMN     "uploadedVideoName" TEXT NOT NULL,
DROP COLUMN "event",
ADD COLUMN     "event" "EventStatus" NOT NULL;
