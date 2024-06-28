import User from "./User.js";
class Message {
  id: string;
  content: string;
  sender: User;
  timeSent: Date;
  constructor(content: string, sender: User) {
    this.id = "";
    this.content = content;
    this.sender = sender;
    this.timeSent = new Date();
  }

  setContent(content: string): void {
    this.content = content;
  }
  getContent(): string {
    return this.content;
  }
  setSender(sender: User): void {
    this.sender = sender;
  }
  getSender(): User {
    return this.sender;
  }
  getTimeStamp(): string {
    return this.timeSent.toLocaleString("pt-BR");
  }
  toString(): string {
    return JSON.stringify({
      id: this.id,
      content: this.content,
      sender: this.sender,
      timeSent: this.timeSent,
    });
  }
  toJSON() {
    return {
      id: this.id,
      content: this.content,
      sender: this.sender,
      timeSent: this.timeSent.toLocaleString("pt-BR"),
    };
  }
}

export default Message;
