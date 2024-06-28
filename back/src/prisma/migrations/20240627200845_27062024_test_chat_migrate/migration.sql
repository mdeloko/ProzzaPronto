-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "completeName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" VARCHAR(25) NOT NULL,
    "email" TEXT NOT NULL,
    "isAdm" BOOLEAN NOT NULL DEFAULT false,
    "isBanned" BOOLEAN NOT NULL DEFAULT false,
    "telephoneNumber" VARCHAR(11) NOT NULL,
    "addressId" INTEGER NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" SERIAL NOT NULL,
    "zip" VARCHAR(8) NOT NULL,
    "street" TEXT NOT NULL,
    "number" VARCHAR(5) NOT NULL,
    "complement" TEXT NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" SERIAL NOT NULL,
    "completeName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" VARCHAR(25) NOT NULL,
    "email" TEXT NOT NULL,
    "isAdm" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "content" TEXT NOT NULL,
    "senderId" UUID NOT NULL,
    "timeSent" TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chats" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "messageId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "adminId" INTEGER,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bans" (
    "id" BIGSERIAL NOT NULL,
    "banTime" TIMESTAMPTZ NOT NULL,
    "adminId" INTEGER NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "bans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" SERIAL NOT NULL,
    "ownerId" UUID NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "friend" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "contactsId" INTEGER,

    CONSTRAINT "friend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blocked" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "contactsId" INTEGER,

    CONSTRAINT "blocked_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ChatToUser" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admins_id_key" ON "admins"("id");

-- CreateIndex
CREATE UNIQUE INDEX "admins_username_key" ON "admins"("username");

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "messages_id_key" ON "messages"("id");

-- CreateIndex
CREATE UNIQUE INDEX "chats_id_key" ON "chats"("id");

-- CreateIndex
CREATE UNIQUE INDEX "contacts_ownerId_key" ON "contacts"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "_ChatToUser_AB_unique" ON "_ChatToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ChatToUser_B_index" ON "_ChatToUser"("B");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bans" ADD CONSTRAINT "bans_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bans" ADD CONSTRAINT "bans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friend" ADD CONSTRAINT "friend_contactsId_fkey" FOREIGN KEY ("contactsId") REFERENCES "contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocked" ADD CONSTRAINT "blocked_contactsId_fkey" FOREIGN KEY ("contactsId") REFERENCES "contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatToUser" ADD CONSTRAINT "_ChatToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatToUser" ADD CONSTRAINT "_ChatToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
