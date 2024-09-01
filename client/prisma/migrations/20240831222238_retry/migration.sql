/*
  Warnings:

  - Made the column `status` on table `UploadedVideo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "UploadedVideo" ALTER COLUMN "status" SET NOT NULL;
