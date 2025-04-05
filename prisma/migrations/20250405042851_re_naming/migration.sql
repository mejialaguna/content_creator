/*
  Warnings:

  - You are about to drop the column `generatedText` on the `ContentData` table. All the data in the column will be lost.
  - Added the required column `generatedContent` to the `ContentData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ContentData" DROP COLUMN "generatedText",
ADD COLUMN     "generatedContent" TEXT NOT NULL;
