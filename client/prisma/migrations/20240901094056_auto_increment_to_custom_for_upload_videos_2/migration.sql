/*
  Warnings:

  - The primary key for the `TranscodedVideo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `UploadedVideo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "TranscodedVideo" DROP CONSTRAINT "TranscodedVideo_sourceVideoId_fkey";

-- DropForeignKey
ALTER TABLE "UploadedVideo" DROP CONSTRAINT "UploadedVideo_userId_fkey";

-- AlterTable
ALTER TABLE "TranscodedVideo" DROP CONSTRAINT "TranscodedVideo_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "sourceVideoId" SET DATA TYPE TEXT,
ADD CONSTRAINT "TranscodedVideo_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "TranscodedVideo_id_seq";

-- AlterTable
ALTER TABLE "UploadedVideo" DROP CONSTRAINT "UploadedVideo_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "UploadedVideo_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AddForeignKey
ALTER TABLE "UploadedVideo" ADD CONSTRAINT "UploadedVideo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranscodedVideo" ADD CONSTRAINT "TranscodedVideo_sourceVideoId_fkey" FOREIGN KEY ("sourceVideoId") REFERENCES "UploadedVideo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
