const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const app = express();
const server = createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
app.use(express.static(__dirname + "/static"));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "static/index.html"));
});
let guestcounter = 0;
io.on("connection", (socket) => {
  socket.on("new-user", (name) => {
    socket.username = name? name : `Guest #${++guestcounter}`
    socket.broadcast.emit("user-connected", socket.username);
    console.log(`${socket.username} is connected`);
  });
  socket.on("disconnect", () => {
    console.log(`${socket.username} has disconnected`);
    socket.broadcast.emit('user-disconnected',socket.username);
  });

  socket.on("send-chat-message", (message) => {
    socket.broadcast.emit("chat-message", `${socket.username}: ${message}`);
    console.log("message", message);
  });



});
server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
