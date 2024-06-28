import { createServer } from "node:http";
import { Server } from "socket.io";
import AdminController from "./Controllers/AdminController.js";
import { LoginResponses, UserController } from "./Controllers/UserController.js";
import MessageController from "./Controllers/MessageController.js";
import ChatController from "./Controllers/ChatController.js";
const ac = new AdminController();
const uc = new UserController();
const mc = new MessageController();
const cc = new ChatController();
ac.start("adm1");
const port = Number(process.env.PORT);
const hostname = process.env.SV_HOSTNAME;
let usrSender;
let usrReceiver;
const httpServer = createServer();
const ioServer = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:4000"],
        methods: ["GET", "POST"]
    }
});
ioServer.on("connection", (client) => {
    ioServer.socketsJoin("server");
    ioServer.socketsLeave(client.id);
    console.log("[Backend - Server.ts] Usuário conectado! ID:", client.id, "na sala:", client.rooms);
    client.on("disconnect", () => {
        console.log("[Backend - Server.ts] Usuário desconectado! ID:", client.id);
        //ToDo: Aqui seta status offline
    });
    client.on("requestRoom", (sender, receiver, actRoom, callback) => {
        if (sender && receiver) {
            const room = [sender, receiver].sort().join("-");
            if (client.rooms.has(room)) {
                callback(200, `[Backend - Server.ts] Já estava na sala: ${room}`);
            }
            if (actRoom !== room) {
                client.leave(actRoom);
                console.log(`[Backend - Server.ts] ${sender} trocou de chat...`);
            }
            callback(200, room);
            client.join(room);
            console.log(`[Backend - Server.ts] ${sender} entrou na sala ${room}`);
        }
        else {
            callback(404, null);
        }
    });
    client.on("message", async (userSent, userReceive, msg) => {
        try {
            usrSender = await uc.findUserByUsername(userSent);
            usrReceiver = await uc.findUserByUsername(userReceive);
            if (usrSender && usrReceiver) {
                const mg = await mc.createMsg(msg, usrSender, usrReceiver);
                console.log(`[Backend - Server.ts] ${userSent} disse para ${userReceive}: ${msg}`);
                client.emit("returnMessage", usrSender.id, usrReceiver.id, mg.content, mg.timeSent.getHours(), mg.timeSent.getMinutes());
            }
        }
        catch (err) {
            console.error(err);
        }
    });
    client.on("createAccount", async (completeName, username, password, email, telephoneNumber, zip, street, number, complement, callback) => {
        try {
            const newUsr = await uc.createUser(completeName, username, password, email, telephoneNumber, zip, street, number, complement);
            if (newUsr) {
                console.log(`[Backend - Server.ts] usuário ${newUsr.username} criado com sucesso!`);
                callback(200);
            }
            else {
                console.error(`[Backend - Server.ts] erro ao criar ${username}!`);
                callback(500);
            }
        }
        catch (err) {
            console.error("[Backend - Server.ts] erro interno:", err);
        }
    });
    client.on("updateUser", async (completeName, username, password, email, telephoneNumber, zip, street, number, complement, callback) => {
        try {
            const actUsr = await uc.findUserByUsername(username);
            if (actUsr) {
                const updtUsrAddr = await uc.updateUserAddress(username, zip, street, number, complement);
                const updtUsr = await uc.updateUser(completeName, username, password, email, telephoneNumber);
                if (updtUsrAddr && updtUsr) {
                    console.log(`[Backend - Server.ts] Usuário (${username}) atualizado!`);
                    callback(200);
                    return updtUsr;
                }
                else {
                    callback(500);
                    return null;
                }
            }
        }
        catch (err) {
            callback(500);
            console.error("[Backend - Server.ts] erro interno:", err);
            return null;
        }
    });
    client.on("loginTry", async (str, password, callback) => {
        try {
            const res = await uc.checkLogin(str, password);
            if (res == LoginResponses.FOUND) {
                console.log(`Usuário ${str} logado!`);
                callback(200);
            }
            else if (res == LoginResponses.WRONG_PASSWORD) {
                console.log(`[Backend - Server.ts] Usuário ${str}, senha errada!`);
                callback(401);
            }
            else {
                console.log(`[Backend - Server.ts] Usuário ${str} não encontrado!`);
                callback(404);
            }
        }
        catch (err) {
            console.error("[Backend - Server.ts] Erro no servidor:", err);
        }
    });
    client.on("requestMessages", async (sender, receiver, callback) => {
        try {
            const chat = await cc.retrieveChatByUsernames(sender, receiver);
            if (chat) {
                console.log(`[Backend - Server.ts] enviando histórico de chat de (${sender}-${receiver}) para (${sender})!`);
                callback(200, chat.messages);
            }
            else {
                const newChat = await cc.createChat(sender, receiver);
                console.log(`[Backend - Server.ts] não pude enviar histórico de chat de (${sender}-${receiver}) para (${sender}),criando!`);
                callback(404, newChat?.messages);
            }
        }
        catch (err) {
            console.error("[Backend - Server.ts] Erro:", err);
        }
    });
    client.on("addFriend", async (sender, str) => {
        try {
            await uc.addFriend(sender, str);
            console.log(`[Backend - Server.ts] (${str}) adicionado a lista de (${sender})`);
        }
        catch (err) {
            console.error(`[Backend - Server.ts] (${str}) não adicionado a lista de (${sender}), erro:`, err);
        }
    });
    client.on("retrieveUserId", async (username, callback) => {
        const usr = await uc.findUserByUsername(username);
        callback(usr?.id);
    });
    client.on("retrieveUsernameIdByEmail", async (email, callback) => {
        const usr = await uc.findUserByEmail(email);
        if (usr) {
            callback(usr.email);
        }
    });
    client.on("retrieveFriendList", async (username, callback) => {
        const usr = await uc.requestFriends(username);
        callback(usr);
    });
});
httpServer.listen(port, () => { console.log("[Backend] Servidor ouvindo em: http://" + hostname + ":" + port); });
