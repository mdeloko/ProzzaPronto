
let storage = window.sessionStorage;

export function getUser(){
    return storage.getItem('user');
}
export function setUser(newUser){
    storage.setItem('user',newUser);
}

export function getId(){
    return storage.getItem('id');
}
export function setId(newId){
    storage.setItem('id',newId);
}

export function getPasswd(){
    return storage.getItem('password');
}
export function setPasswd(newPasswd){
    storage.setItem('password',newPasswd);
}

export function getRoom(){
    return storage.getItem('room');
}
export function setRoom(newRoom){
    storage.setItem('room',newRoom);
}

export function getReceiver(){
    return storage.getItem('receiver');
}
export function setReceiver(newReceiver){
    storage.setItem('receiver',newReceiver);
}