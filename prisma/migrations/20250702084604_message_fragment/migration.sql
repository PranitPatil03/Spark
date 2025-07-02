/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "MessageRole" AS ENUM ('USER', 'ASSISTANT');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('USER', 'ASSISTANT');

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "role" "MessageRole" NOT NULL,
    "type" "MessageType" NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fragment" (
    "id" TEXT NOT NULL,
    "messagesId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sandboxUrl" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "files" JSONB NOT NULL,

    CONSTRAINT "Fragment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Fragment_messagesId_key" ON "Fragment"("messagesId");

-- AddForeignKey
ALTER TABLE "Fragment" ADD CONSTRAINT "Fragment_messagesId_fkey" FOREIGN KEY ("messagesId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
