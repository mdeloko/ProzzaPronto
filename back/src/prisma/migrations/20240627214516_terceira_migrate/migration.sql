/*
  Warnings:

  - You are about to drop the `bans` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `blocked` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `contacts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `friend` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "bans" DROP CONSTRAINT "bans_adminId_fkey";

-- DropForeignKey
ALTER TABLE "bans" DROP CONSTRAINT "bans_userId_fkey";

-- DropForeignKey
ALTER TABLE "blocked" DROP CONSTRAINT "blocked_contactsId_fkey";

-- DropForeignKey
ALTER TABLE "contacts" DROP CONSTRAINT "contacts_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "friend" DROP CONSTRAINT "friend_contactsId_fkey";

-- AlterTable
ALTER TABLE "messages" ALTER COLUMN "timeSent" SET DEFAULT now();

-- DropTable
DROP TABLE "bans";

-- DropTable
DROP TABLE "blocked";

-- DropTable
DROP TABLE "contacts";

-- DropTable
DROP TABLE "friend";

-- CreateTable
CREATE TABLE "_UserContacts" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserContacts_AB_unique" ON "_UserContacts"("A", "B");

-- CreateIndex
CREATE INDEX "_UserContacts_B_index" ON "_UserContacts"("B");

-- AddForeignKey
ALTER TABLE "_UserContacts" ADD CONSTRAINT "_UserContacts_A_fkey" FOREIGN KEY ("A") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserContacts" ADD CONSTRAINT "_UserContacts_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
