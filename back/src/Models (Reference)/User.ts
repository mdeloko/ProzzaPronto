import { Person } from "./Person.js";
class User extends Person {
  protected id: string;
  protected telephone: string;

  constructor(
    completeName: string,
    userName: string,
    password: string,
    email: string,
    isAdm: boolean,
    telephone: string
  ) {
    super(completeName, userName, password, email, isAdm);
    this.id = ""; //IMPLEMENTAR CRIAÇÃO AUTOMATICA DE IDs
    this.telephone = telephone;
  }

  getTelephone(): string {
    return this.telephone;
  }
}

export default User;
