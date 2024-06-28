import { Message, PrismaClient, User } from "@prisma/client";
const db = new PrismaClient();
class MessageController {

  constructor(){
  }
  async createMsg(content:string,sender:User,receiver:User){
    const msg = await db.message.create({data:{
      content:content,
      senderId:sender.id
    }});
    const chat = await db.chat.findFirst({
      where:{
        Users:{
          some:{
            id:sender.id
          }
        },AND:{
          Users:{
            some:{
              id:receiver.id
            }
          }
        }
      },include:{
        Users:true,
        messages:true
      }
    });
    if(chat){
      await db.chat.update({
        where:{
          id:chat.id
        },
        data:{
          messages:{
            connect:{
              id:msg.id
            }
          }
        }
      })
      return msg;
    }else{
      await db.chat.create({
        data:{
          Users:{
            connect:[{id:sender.id},{id:receiver.id}]
          },
          messages:{
            connect:{id:msg.id}
          }
        }
      })
      return msg;
    }
  }
  async findMsgIdByContent(content:string):Promise<Message|null>{
    return await db.message.findFirst({where:{content:content}})
  }
  async findMsgIdByUserIdAndTime(sender:string,time:Date):Promise<Message|null>{
    return await db.message.findFirst({where:{senderId:sender,timeSent:time}})
  }
  async deleteMsg(id:string){
    await db.message.delete({where:{id:id}})
  }
  async updateMsg(id:string,content:string){
    await db.message.update({where:{id:id},data:{
      content:content
    }})
  }
}

export default MessageController;
