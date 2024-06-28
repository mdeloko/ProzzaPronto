import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
class MessageController {
    constructor() {
    }
    async createMsg(content, sender, receiver) {
        const msg = await db.message.create({ data: {
                content: content,
                senderId: sender.id
            } });
        const chat = await db.chat.findFirst({
            where: {
                Users: {
                    some: {
                        id: sender.id
                    }
                }, AND: {
                    Users: {
                        some: {
                            id: receiver.id
                        }
                    }
                }
            }, include: {
                Users: true,
                messages: true
            }
        });
        if (chat) {
            await db.chat.update({
                where: {
                    id: chat.id
                },
                data: {
                    messages: {
                        connect: {
                            id: msg.id
                        }
                    }
                }
            });
            return msg;
        }
        else {
            await db.chat.create({
                data: {
                    Users: {
                        connect: [{ id: sender.id }, { id: receiver.id }]
                    },
                    messages: {
                        connect: { id: msg.id }
                    }
                }
            });
            return msg;
        }
    }
    async findMsgIdByContent(content) {
        return await db.message.findFirst({ where: { content: content } });
    }
    async findMsgIdByUserIdAndTime(sender, time) {
        return await db.message.findFirst({ where: { senderId: sender, timeSent: time } });
    }
    async deleteMsg(id) {
        await db.message.delete({ where: { id: id } });
    }
    async updateMsg(id, content) {
        await db.message.update({ where: { id: id }, data: {
                content: content
            } });
    }
}
export default MessageController;
