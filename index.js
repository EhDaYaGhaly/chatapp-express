const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const path = require('path')
const app = express();
const server = createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use('/static', express.static(path.join(__dirname, 'static')));


app.get("/", (req, res) => {
  res.send('Hello ?') 
});



app.get('/room/:id' ,(req,res)=>{
  res.sendFile(join(__dirname,'index.html'))
})



let guestcounter = 0;
io.on("connection", (socket) => {
  socket.on("join-room", (room ,name) => {
    socket.username = name? name : `Guest #${++guestcounter}`
    socket.join(room)
    socket.to(room).emit("user-connected", socket.username);
    console.log(`${socket.username} is connected to room ${room}`);
  });
  socket.on("disconnect", () => {
    console.log(`${socket.username} has disconnected`);
    io.emit('user-disconnected',socket.username);
  });
  



  socket.on("send-chat-message", (room ,message) => {
    socket.to(room).emit("chat-message", `${socket.username}: ${message}`);
    console.log("message", message);
  });
});





app.get('/room',(req,res)=>{
  console.log('this is room page')
  res.sendFile(join(__dirname, "/selectRoom.html"))
})
// --------   Errors  -------------
app.use((req, res) => {
  res.status(404).send("Page not found");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
  
});
server.listen(3002, () => {
  console.log("server running at http://localhost:3002/room");
});





// //  LATER
// socket.on("join-room", (room) => {
//   socket.join(room);
//   socket.to(room).emit("user-connected", socket.username);
// });

// socket.on("send-chat-message", (room, message) => {
//   socket.to(room).emit("chat-message", `${socket.username}: ${message}`);
// });