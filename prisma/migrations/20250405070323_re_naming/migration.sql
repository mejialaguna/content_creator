-- AlterTable
ALTER TABLE "UserStats" ADD COLUMN     "adCopyCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "blogPostCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "productDescriptionCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "socialMediaCount" INTEGER NOT NULL DEFAULT 0;
