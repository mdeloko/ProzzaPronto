export abstract class Person{
    protected completeName: string;
    protected userName: string;
    protected password: string;
    protected email: string;
    protected isAdm: boolean;

    constructor(completeName: string,userName: string,password: string,email: string,isAdm: boolean){
        this.completeName = completeName;
        this.userName = userName;
        this.password = password;
        this.email = email;
        this.isAdm = isAdm;
    }

    setCompleteName(completeName:string):void{
        this.completeName = completeName;
    }
    setUserName(userName:string):void{
        this.userName = userName;
    }
    setPassword(password:string):void{
        this.password = password;
    }
    setEmail(email:string):void{
        this.email = email;
    }
    setIsAdm(isAdm:boolean):void{
        this.isAdm = isAdm;
    }

    getCompleteName():string{
        return this.completeName;
    }
    getUserName():string{
        return this.userName;
    }
    getPassword():string{
        return this.password;
    }
    getEmail():string{
        return this.email;
    }
    getIsAdm():boolean{
        return this.isAdm;
    }
}