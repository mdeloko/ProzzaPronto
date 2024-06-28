/*
  Warnings:

  - You are about to drop the column `messageId` on the `chats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "chats" DROP COLUMN "messageId";

-- AlterTable
ALTER TABLE "messages" ALTER COLUMN "timeSent" SET DEFAULT now();
