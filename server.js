const http = require('http');
const express = require('express');
const cors = require('cors');
const socketIO = require('socket.io');

const app = express();

const users=[{}];
const server = http.createServer(app);
const io = socketIO(server);

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

