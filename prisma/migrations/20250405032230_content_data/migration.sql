-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'user');

-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('blogPost', 'productDescription', 'socialMedia', 'adCopy');

-- CreateEnum
CREATE TYPE "ContentTone" AS ENUM ('formal', 'casual', 'persuasive', 'informative', 'funny');

-- CreateEnum
CREATE TYPE "OpenAIModelModelType" AS ENUM ('gpt-3.5-turbo', 'gpt-4');

-- CreateEnum
CREATE TYPE "Tier" AS ENUM ('free', 'pro', 'business');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'user',
    "tierType" "Tier" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentData" (
    "id" TEXT NOT NULL,
    "contentType" "ContentType" NOT NULL,
    "topic" TEXT NOT NULL,
    "tone" "ContentTone" NOT NULL,
    "model" "OpenAIModelModelType" NOT NULL,
    "keywords" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ContentData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "ContentData_userId_idx" ON "ContentData"("userId");

-- AddForeignKey
ALTER TABLE "ContentData" ADD CONSTRAINT "ContentData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
