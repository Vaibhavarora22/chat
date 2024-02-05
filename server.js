import http from 'http';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import path from 'path';
import {fileURLToPath} from 'url';

//configure env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const  __dirname = path.dirname(__filename);

const app = express();
//const io = new Server(server);

const users=[{}];
app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname , './client/build')));
//rest api
app.use('*' , function(req,res){
    res.sendFile(path.join(__dirname , "./client/build/index.html"));
})
const server = http.createServer(app);
//const io = socketIO(server);
const io = new Server(server);





io.on("connection" , (socket)=>{
    console.log("New Connection");

    //socket.on is used to recieve data from emit 'joined should be common in emit and on
    socket.on('joined',({user})=>{
        users[socket.id]=user;
        console.log(`${user} has joined `);
        socket.broadcast.emit('userJoined',{user:"Admin",message:` ${users[socket.id]} has joined`});
        socket.emit('welcome',{user:"Admin",message:`Welcome to the chat,${users[socket.id]} `})
    })

    socket.on('message',({message,id})=>{
        io.emit('sendMessage',{user:users[id],message,id});
    })

    socket.on('disconnect',()=>{
        socket.broadcast.emit('leave',{user:"Admin",message:`${users[socket.id]}  has left`});
        console.log(`user left`);
    })
})

app.get("/" , (req,res) => {
    res.send("Hello it's working");
})

const PORT = process.env.PORT || 8080;
server.listen(PORT , () => {
    console.log(`server running on ${PORT}`);
})

