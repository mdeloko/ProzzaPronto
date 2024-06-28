import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
class AdminController {
    constructor(username) {
        if (username) {
            this.start(username);
        }
    }
    async start(username) {
        this.adm = await db.admin.findUnique({
            where: {
                username: username,
            },
        });
    }
    async createAdmin(username, password, email, completeName) {
        return await db.admin.create({ data: { username: username, password: password, email: email, completeName: completeName } });
    }
    async banUserById(id) {
        let usr = await db.user.findUnique({ where: { id: id } });
        if (usr) {
            usr = await db.user.update({ where: { id: id }, data: { isBanned: true } });
            console.log(`[Backend - AdminController] User: (${usr.id}) - (${usr.username}): Usuário Banido!`);
            return true;
        }
        else {
            console.log(`[Backend - AdminController] User: (${id}): Usuário não banido!`);
            return false;
        }
    }
    async banUserByEmail(email) {
        let usr = await db.user.findUnique({ where: { email: email } });
        if (usr) {
            usr = await db.user.update({ where: { email: email }, data: { isBanned: true } });
            console.log(`[Backend - AdminController] User: (${usr.id}) - (${usr.email}): Usuário Banido!`);
            return true;
        }
        else {
            console.log(`[Backend - AdminController] User: (${email}): Usuário não banido!`);
            return false;
        }
    }
    async banUserByUsername(username) {
        let usr = await db.user.findUnique({ where: { username: username } });
        if (usr) {
            usr = await db.user.update({ where: { username: username }, data: { isBanned: true } });
            console.log(`[Backend - AdminController] User: (${usr.id}) - (${usr.username}): Usuário Banido!`);
            return true;
        }
        else {
            console.log(`[Backend - AdminController] User: (${username}): Usuário não banido!`);
            return false;
        }
    }
}
export default AdminController;
