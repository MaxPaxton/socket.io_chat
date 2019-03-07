var express = require('express');
var backend = require('./backend/app');
var http = require('http');
var path = require("path");
var mongoose = require("mongoose");
var app = express();

// connect to mongodb
app.use(backend)

//Set Engine
app.set("view engine","ejs");
//middlewares
app.use(express.static("client"));
//routes
app.get('/',(req,res)=>{
  res.render('index');
})
var server = require('http').Server(app);
var io = require('socket.io')(server);

io.set('heartbeat timeout', 4000); 
io.set('heartbeat interval', 2000);


//arrays
connections = [];
online_users = [];
rooms = ["Work Chat","School Chat","Friend Chat"];

server.listen(3000);
// WARNING: app.listen(80) will NOT work here!


io.on('connection', function (socket) {
  console.log("Connected...id:"+socket.id);

  connections.push(socket);
  console.log("Connected: %s sockets connected", connections.length);

  //default username
  socket.username = "Anonymous";
  console.log("id:"+socket.id+" and username"+socket.username);

  //Set Username and join Room
  socket.on("joinRoom", function(data,callback){
    callback(true);
    if(rooms.includes(data.room)){
      socket.join(data.room);
      socket.username = data.username;
      socket.room = data.room;
      connections[connections.indexOf(socket)].username = socket.username;
      online_users.push({id: socket.id ,username: socket.username, room: socket.room})
      console.log(online_users);
      io.sockets.in(data.room).emit("get users",online_users);
    }
});

  //Send Message
  socket.on('chat', function(data){
    console.log(data);
    io.sockets.to(data.room).emit('chat', data);
   });
  socket.on("typing",function(data){
    socket.broadcast.to(data.room).emit("typing",data.username);
  });

  //Disconnect
  socket.on("disconnect", function(data){
    online_users.splice(online_users.indexOf({id: socket.id ,username: socket.username, room: socket.room}),1);
    socket.broadcast.emit("get users",online_users);
    console.log("Disconnected: "+online_users.length); 
  })
});