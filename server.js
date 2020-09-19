const path=require("path");
const http=require("http");
const express=require("express");
const app=express();
const socketio=require('socket.io');
const server=http.createServer(app);
const io = socketio(server);
const formatMessage=require('./utils/messages');
const { userJoin, getCurrentUser,userLeave, getRoomUsers} = require("./utils/users");
const botName="Easychat";
//run when client connect
 io.on('connection', socket=>{
     socket.on('joinRoom',({username,room})=>{
         const user=userJoin(socket.id,username,room);
         socket.join(user.room);
    //welcome current user
    socket.emit('message', formatMessage(botName,"welcome to easychat!"));

    //Broadcast when a user connects
    socket.broadcast.to(user,room).emit('message',formatMessage(botName,`${user.username}has joined the chat` ));
     //send user and room info
     io.to(user.room).emit('roomUsers',{
         room:user.room,
         users:getRoomUsers(user.room)
     });

   });
     console.log("new ws connection...");


//listen for chat message
socket.on('chatMessage', msg => {
    const user=getCurrentUser(socket.id);
    io.to(user.room).emit('message',formatMessage(user.username, msg));
});
//Run when client disconnect
socket.on('disconnect', () =>{
    const user=userLeave(socket.id)
    if(user){
    io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`));
    }
});
});

const PORT= 3000 || process.env.PORT;
//set statit folder
app.use(express.static(path.join(__dirname,'public')));
server.listen(PORT,()=>console.log(`server running on port ${PORT}`));