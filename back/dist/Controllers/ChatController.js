import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
class ChatController {
    async createChat(sender, receiver) {
        try {
            const chat = await db.chat.create({
                data: {
                    Users: {
                        connect: [{ username: sender }, { username: receiver }]
                    }
                }, include: {
                    messages: true
                }
            });
            return chat;
        }
        catch (err) {
            console.log("Não foi possível criar chat, erro:", err);
        }
    }
    async retrieveChatByUsernames(sender, receiver) {
        try {
            const chat = await db.chat.findFirst({ where: { Users: { some: { username: sender } }, AND: { Users: { some: { username: receiver } } } }, include: { messages: true } });
            if (chat) {
                console.log(`[Backend - ChatController] chat (${sender}-${receiver}) encontrado!`);
                return chat;
            }
            else {
                console.log(`[Backend - ChatController] chat (${sender}-${receiver}) não encontrado!`);
            }
        }
        catch (err) {
            console.error("[Backend - ChatController] erro:", err);
        }
    }
}
export default ChatController;
