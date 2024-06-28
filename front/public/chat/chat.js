import {getUser,getPasswd,getRoom,setRoom,setReceiver,getReceiver,getId, setUser} from "../js/loginProperties.js"
import {ws} from "../ws.js"

const usr = getUser();
const pwd = getPasswd();
const id = getId();
console.log(usr,pwd,id);
if(usr==""||pwd==""){
    alert("Por favor faça login!");
    window.location.href = "/";
}
const friendList = document.querySelector("ol");
function populateFriendList(){
    ws.emit("retrieveFriendList",getUser(),/**@param {User[]} friends*/(friends)=>{
        friends.forEach(friend=>{
            const li = document.createElement("li")
            li.innerHTML = `${friend.completeName}<br><span class="username">${friend.username}</span>`;
            friendList.appendChild(li)
        });

    });
}
populateFriendList();
ws.emit("retrieveUsernameIdByEmail",getUser(),(res)=>{
    setUser(res);
})

const chatBox = document.querySelector("#textBox")

function requestRoom(sender,receiver){
    ws.emit("requestRoom",sender,receiver,getRoom(),(res,room)=>{
    if(res==200){
        setRoom(room)
        console.log(room)
    }else{
        alert("Erro ao conectar com usuário!");
    }
});}

function requestMessages(sender,receiver){
    ws.emit("requestMessages",sender,receiver,/**@param {Message[]} msgs*/(res,msgs)=>{
        let limpa = document.querySelectorAll(".msgSentContainer");
        limpa.forEach(li=>li.remove());
        limpa = document.querySelectorAll(".msgReceivedContainer");
        limpa.forEach(li=>li.remove());
        if(res==200){
            //ToDo: exibir msgs, comparando senderId de cada mensagem com o meu próprio id para saber se a msg é minha e altera o balão, ou não é minha
            msgs.forEach(msg=>{
                if(msg.senderId==getId()){
                    const div = document.createElement("div");
                    div.classList.add("msgSentContainer");
                    const content = document.createElement("p");
                    content.classList.add("msgContent");
                    const time = document.createElement("p");
                    time.classList.add("msgTime");
                    content.innerHTML = msg.content;
                    time.innerHTML = msg.timeSent;
                    chatBox.appendChild(div);
                    div.appendChild(content);
                    div.appendChild(time);
                }else{
                    const div = document.createElement("div");
                    div.classList.add("msgReceivedContainer");
                    const sender = document.createElement("p");
                    sender.classList.add("msgSender");
                    const content = document.createElement("p");
                    content.classList.add("msgContent");
                    const time = document.createElement("p");
                    time.classList.add("msgTime");
                    sender.innerHTML = getReceiver();
                    content.innerHTML = msg.content;
                    time.innerHTML = msg.timeSent;
                    chatBox.appendChild(div);
                    div.appendChild(sender);
                    div.appendChild(content);
                    div.appendChild(time);
                }
            });
        }else{
            //ToDo: informar erro ao receber mensagens do servidor
        }
    })
}

const olItems = document.querySelector("ol");
console.log(friendList.lastChild.innerHTML)
//TODO TERMINAR ESSES MÉTODO
olItems.addEventListener("click", (event) => {
    if (event.target.tagName === "LI") {
      const li = event.target;
      const startIdx = li.innerHTML.indexOf("username\">") + 10;
      const endIdx = li.innerHTML.indexOf("</span>");
      const username = li.innerHTML.substring(startIdx, endIdx);
      setReceiver(username);
      requestRoom(getUser(), getReceiver());
      requestMessages(getUser(), getReceiver());
    }
  });

const sendMsgForm = document.querySelector("#textEnterContainer");
const msg = document.querySelector("#msgText");
sendMsgForm.addEventListener("submit",(evt)=>{
    evt.preventDefault();
    if(!getRoom()){
        alert("Não foi possível iniciar comunicação com usuário!")
    }

    ws.emit("message",getUser(),getReceiver(),msg.value,getRoom());
    msg.value = "";
    requestMessages(getUser(),getReceiver());

});

ws.on("returnMessage",(senderId,receiverId,msgContent,hr,mn)=>{
    let hour = hr.toString(); 
    let min = mn.toString();
    hour = hr < 10? "0"+hour : hour; 
    min = mn < 10? "0"+min : min;
    if(senderId===getId()){
        const div = document.createElement("div");
        div.classList.add("msgSentContainer");
        const content = document.createElement("p");
        content.classList.add("msgContent");
        const time = document.createElement("p");
        time.classList.add("msgTime");
        content.innerHTML = msgContent;
        time.innerHTML = hour+":"+min;
        chatBox.appendChild(div);
        div.appendChild(content);
        div.appendChild(time);
    }else{
        const div = document.createElement("div");
        div.classList.add("msgReceivedContainer");
        const sender = document.createElement("p");
        sender.classList.add("msgSender");
        const content = document.createElement("p");
        content.classList.add("msgContent");
        const time = document.createElement("p");
        time.classList.add("msgTime");
        sender.innerHTML = getReceiver();
        content.innerHTML = msgContent;
        time.innerHTML = hour+":"+min;
        chatBox.appendChild(div);
        div.appendChild(sender);
        div.appendChild(content);
        div.appendChild(time);
    }
});

const addFriendBtn = document.querySelector("#addFriend")
addFriendBtn.addEventListener("click",(event)=>{
    event.preventDefault();
    const user = prompt("Qual o username/email do seu amigo?");
    ws.emit("addFriend",getUser(),user);
    window.location.reload();
})