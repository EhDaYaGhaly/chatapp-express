// add auth
// add more frontend because it looks like shit 



const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const path = require("path");
const app = express();
const server = createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use("/static", express.static(path.join(__dirname, "static")));

app.get("/", (req, res) => {
  res.send("Hello ?");
});



app.get("/room", (req, res) => {
  res.sendFile(join(__dirname, "/selectRoom.html"));
});
app.get("/room/:id", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});
// --------   Errors  -------------



server.listen(3002, () => {
  console.log("server running at http://localhost:3002/room");
});



// TODO

// socket can have join multiple rooms with different names
// 1st approach:  make socket act like a dict , where keys are roomID , and values are socket parameters (name , photo , etc...)
// ^^ this approach will be much simpler with a db, and auth

let guestcounter = 0;
io.on("connection", (socket) => {
  socket.on("join-room", (room, name) => {
    socket.username = name ? name : `Guest #${++guestcounter}`;
    socket.room = room
    socket.join(room);
    console.log(socket.room)
    socket.to(room).emit("user-connected", socket.username);
    console.log(`${socket.username} is connected to room ${room}`);
  });
  socket.on("disconnect", () => {
    console.log(`${socket.username} has disconnected`);
   socket.to(socket.room).emit("user-disconnected", socket.username);
  });

  socket.on("send-chat-message", (room, message) => {
    socket.to(room).emit("chat-message", `${socket.username}: ${message}`);
    console.log("message", message);
  });
});








app.use((req, res) => {
  res.status(404).send("Page not found");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});
