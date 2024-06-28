import {ws} from "../ws.js"
import {setUser,setPasswd,getUser,getPasswd} from "../js/loginProperties.js"

const name = document.querySelector("#completeNameInput");
const email = document.querySelector("#emailInput");
const userInpt = document.querySelector("#userInput");
const telephone = document.querySelector("#telephoneInput");
const passwdInpt = document.querySelector("#passwdInput");
const zip = document.querySelector("#zipInput");
const street = document.querySelector("#streetInput");
const number = document.querySelector("#numberInput");
const complement = document.querySelector("#complementInput");
const form = document.querySelector("#createAccountForm");
const aHAccount = document.querySelector("#alreadyHaveAccountBtn");

form.addEventListener("submit",(evt)=>{
    evt.preventDefault();
    ws.emit("createAccount",name.value,userInpt.value,passwdInpt.value,email.value,telephone.value,zip.value,street.value,number.value,complement.value,(res)=>{
        if(res==200){
            alert("Conta criada com sucesso!");
            setUser(userInpt.value)
            setPasswd(passwdInpt.value)
            ws.emit("loginTry",getUser(),getPasswd(),(res)=>{
                if(res==200){
                    alert("Login automático! Redirecionando...");
                }
            });
            name.value="";
            userInpt.value="";
            passwdInpt.value="";
            email.value="";
            telephone.value="";
            zip.value="";
            street.value="";
            number.value="";
            complement.value="";
        }else{
            window.alert("Erro ao criar conta!");
        }
    });
});

aHAccount.addEventListener("click",()=>{
    window.location.href = "/";
});