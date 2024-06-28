const express = require("express");
const {createServer} = require("node:http");
const path = require("node:path")

const app = express();
const http = createServer(app);

app.use(express.static(path.join(__dirname,"public")));

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"public","index.html"));
});
app.get("/inscrever", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "inscrever" , "inscrever.html"));
});
app.get("/chat", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "chat" , "chat.html"));
});

http.listen(process.env.PORT,()=>{
    console.log("[Frontend] Servidor iniciado em http://localhost:"+process.env.PORT);
});
