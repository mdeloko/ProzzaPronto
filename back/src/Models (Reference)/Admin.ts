import { Person } from "./Person.js";

class Admin extends Person {
  constructor(
    completeName: string,
    userName: string,
    password: string,
    email: string
  ) {
    super(completeName, userName, password, email, true);
  }

  // banUserById(id:string):boolean{

  // }
  // banUserByEmail(email:string):boolean{

  // }
  // banUserByUsername(username:string):boolean{

  // }
}

export default Admin;
