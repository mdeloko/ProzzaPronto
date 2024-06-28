export class Person {
    constructor(completeName, userName, password, email, isAdm) {
        this.completeName = completeName;
        this.userName = userName;
        this.password = password;
        this.email = email;
        this.isAdm = isAdm;
    }
    setCompleteName(completeName) {
        this.completeName = completeName;
    }
    setUserName(userName) {
        this.userName = userName;
    }
    setPassword(password) {
        this.password = password;
    }
    setEmail(email) {
        this.email = email;
    }
    setIsAdm(isAdm) {
        this.isAdm = isAdm;
    }
    getCompleteName() {
        return this.completeName;
    }
    getUserName() {
        return this.userName;
    }
    getPassword() {
        return this.password;
    }
    getEmail() {
        return this.email;
    }
    getIsAdm() {
        return this.isAdm;
    }
}
