-- AlterTable
ALTER TABLE "UploadedVideo" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "UploadedVideo_id_seq";
