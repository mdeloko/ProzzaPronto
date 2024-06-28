import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
export var LoginResponses;
(function (LoginResponses) {
    LoginResponses[LoginResponses["FOUND"] = 0] = "FOUND";
    LoginResponses[LoginResponses["NOT_FOUND"] = 1] = "NOT_FOUND";
    LoginResponses[LoginResponses["WRONG_PASSWORD"] = 2] = "WRONG_PASSWORD";
})(LoginResponses || (LoginResponses = {}));
export const emailRegex = RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}");
export class UserController {
    async createUser(completeName, username, password, email, telephoneNumber, zip, street, number, complement) {
        const userAlredyExists = await db.user.findUnique({
            where: { username, email },
        });
        if (userAlredyExists) {
            console.error("[Backend - UserController] Usuário já existe!");
            return null;
        }
        const addrAlredyExists = await db.address.findFirst({
            where: { zip: zip, street: street, number: number },
        });
        if (addrAlredyExists) {
            console.error("[Backend - UserController] Endereço de usuário já existe!");
            const usr = await db.user.create({
                data: {
                    completeName: completeName,
                    username: username,
                    password: password,
                    email: email,
                    telephoneNumber: telephoneNumber,
                    addressId: addrAlredyExists.id,
                },
            });
            if (usr) {
                console.log(`[Backend - UserController] User: (${usr.id}) - (${usr.username}): Usuário criado!`);
            }
            else {
                console.log(`[Backend - UserController] User: (${username}): Erro na criação de usuário!`);
            }
            return usr;
        }
        else {
            const addr = await db.address.create({
                data: {
                    zip: zip,
                    street: street,
                    number: number,
                    complement: complement,
                },
            });
            const usr = await db.user.create({
                data: {
                    completeName: completeName,
                    username: username,
                    password: password,
                    email: email,
                    telephoneNumber: telephoneNumber,
                    addressId: addr.id,
                },
            });
            if (usr) {
                console.log(`[Backend - UserController] User: (${usr.id}) - (${usr.username}): Usuário criado!`);
            }
            else {
                console.log(`[Backend - UserController] User: (${username}): Erro na criação de usuário!`);
            }
            return usr;
        }
    }
    async updateUser(completeName, username, password, email, telephoneNumber) {
        const actUsr = await db.user.findUnique({ where: { username: username } });
        const usr = await db.user.update({
            where: { username: username },
            data: {
                completeName: completeName,
                username: username,
                password: password,
                email: email,
                telephoneNumber: telephoneNumber,
                addressId: actUsr?.addressId
            },
        });
        if (usr) {
            console.log(`[Backend - UserController] User: (${usr.id}) - (${usr.username}): Usuário atualizado!`);
            return usr;
        }
        else {
            console.log(`[Backend - UserController] User: (${username}) - (${email}): Usuário não atualizado!`);
            return null;
        }
    }
    async updateUserAddress(username, zip, street, number, complement) {
        const usr = await db.user.findUnique({ where: { username: username } });
        const addr = await db.address.findUnique({
            where: { id: usr?.addressId },
        });
        const upsert = await db.address.upsert({
            where: { id: addr?.id },
            update: {
                zip: zip,
                street: street,
                number: number,
                complement: complement,
            },
            create: {
                zip: zip,
                street: street,
                number: number,
                complement: complement,
            },
        });
        if (upsert) {
            console.log(`[Backend - UserController] User: (${usr?.id}) - (${usr?.username}): Endereço atualizado!`);
            return upsert;
        }
        else {
            console.log(`[Backend - UserController] User: (${usr?.id}) - (${usr?.username}): Endereço não atualizado!`);
            return null;
        }
    }
    async findUserById(id) {
        const user = await db.user.findUnique({
            where: { id: id },
            include: { address: true }
        });
        return user;
    }
    async findUserByUsername(username) {
        const user = await db.user.findUnique({
            where: { username: username },
            include: { address: true }
        });
        return user;
    }
    async findUserByEmail(email) {
        const user = await db.user.findUnique({
            where: { email: email },
            include: { address: true }
        });
        return user;
    }
    async checkLogin(username, password) {
        if (!emailRegex.test(username)) {
            const usr = await db.user.findFirst({ where: { username: username } });
            const res = await db.user.findFirst({ where: { username: username, password: password } });
            if (res && usr) {
                return LoginResponses.FOUND;
            }
            else if (usr && !res) {
                return LoginResponses.WRONG_PASSWORD;
            }
            else {
                return LoginResponses.NOT_FOUND;
            }
        }
        else {
            const usr = await db.user.findFirst({ where: { email: username } });
            const res = await db.user.findFirst({ where: { email: username, password: password } });
            if (res && usr) {
                return LoginResponses.FOUND;
            }
            else if (usr && !res) {
                return LoginResponses.WRONG_PASSWORD;
            }
            else {
                return LoginResponses.NOT_FOUND;
            }
        }
    }
    async deleteUser(username) {
        const del = await db.user.delete({ where: { username: username } });
        if (del) {
            console.log(`[Backend - UserController] Usuário (${username}) deletado!`);
        }
        else {
            console.log(`[Backend - UserController] Usuário (${username}) não deletado!`);
        }
    }
    async addFriend(sender, str) {
        if (emailRegex.test(str)) {
            let usr = await db.user.findUnique({ where: { username: sender } });
            const friend = await db.user.findUnique({ where: { email: str } });
            if (usr && friend) {
                usr = await db.user.update({ where: { username: sender }, data: { friends: { connect: { ...friend } } } });
                console.log(`[Backend - UserController] - (${str}) adicionado a friend list de (${sender})`);
                return usr;
            }
            else {
                console.log(`[Backend - UserController] - (${str}) não adicionado a friend list de (${sender})`);
            }
        }
        else {
            let usr = await db.user.findUnique({ where: { username: sender } });
            const friend = await db.user.findUnique({ where: { username: str } });
            if (usr && friend) {
                usr = await db.user.update({ where: { username: sender }, data: { friends: { connect: { ...friend } } } });
                console.log(`[Backend - UserController] - (${str}) adicionado a friend list de (${sender})`);
                return usr;
            }
            else {
                console.log(`[Backend - UserController] - (${str}) não adicionado a friend list de (${sender})`);
            }
        }
    }
    async requestFriends(username) {
        const usr = await db.user.findUnique({ where: { username: username } }).friends();
        return usr;
    }
}
export default UserController;
