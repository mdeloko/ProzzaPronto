import { ws } from "../ws.js";
import {getUser,setUser,setPasswd,setId} from "./loginProperties.js"

const loginForm = document.getElementById("loginForm");
const noAccountButton = document.getElementById("createAccountBtn");
const nameInput = document.getElementById("nameInput");
const passwordInput = document.getElementById("passwordInput")
loginForm.addEventListener("submit",(evt)=>{
    evt.preventDefault(true);
    ws.emit("loginTry",nameInput.value,passwordInput.value,(res)=>{
        if(res==200){
            setUser(nameInput.value);
            setPasswd(passwordInput.value);
            ws.emit("retrieveUserId",getUser(),(id)=>{
                setId(id);
            })
            window.location.href="/chat"
        }else if(res==401){
            alert("Senha incorreta!");
            passwordInput.value="";
        }else{
            alert("Usuário não encontrado!");
            passwordInput.value = "";
            nameInput.value = "";
        }
    });

})

noAccountButton.addEventListener("click",(evt)=>{
    window.location.href = "/inscrever";
});