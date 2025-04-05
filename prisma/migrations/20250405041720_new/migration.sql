/*
  Warnings:

  - Added the required column `generatedText` to the `ContentData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ContentData" ADD COLUMN     "generatedText" TEXT NOT NULL,
ALTER COLUMN "keywords" SET DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "UserStats" (
    "id" TEXT NOT NULL,
    "totalWords" INTEGER NOT NULL DEFAULT 0,
    "totalContents" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserStats_userId_key" ON "UserStats"("userId");

-- AddForeignKey
ALTER TABLE "UserStats" ADD CONSTRAINT "UserStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
