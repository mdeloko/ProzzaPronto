/*
  Warnings:

  - You are about to drop the column `adminId` on the `chats` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `chats` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "chats" DROP CONSTRAINT "chats_adminId_fkey";

-- DropForeignKey
ALTER TABLE "chats" DROP CONSTRAINT "chats_messageId_fkey";

-- AlterTable
ALTER TABLE "chats" DROP COLUMN "adminId",
DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "messages" ALTER COLUMN "timeSent" SET DEFAULT now();

-- CreateTable
CREATE TABLE "_AdminToChat" (
    "A" INTEGER NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_ChatToMessage" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AdminToChat_AB_unique" ON "_AdminToChat"("A", "B");

-- CreateIndex
CREATE INDEX "_AdminToChat_B_index" ON "_AdminToChat"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ChatToMessage_AB_unique" ON "_ChatToMessage"("A", "B");

-- CreateIndex
CREATE INDEX "_ChatToMessage_B_index" ON "_ChatToMessage"("B");

-- AddForeignKey
ALTER TABLE "_AdminToChat" ADD CONSTRAINT "_AdminToChat_A_fkey" FOREIGN KEY ("A") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdminToChat" ADD CONSTRAINT "_AdminToChat_B_fkey" FOREIGN KEY ("B") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatToMessage" ADD CONSTRAINT "_ChatToMessage_A_fkey" FOREIGN KEY ("A") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatToMessage" ADD CONSTRAINT "_ChatToMessage_B_fkey" FOREIGN KEY ("B") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
