const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("input-field");
const sendBtn = document.getElementById("send-button");
const messageContainer = document.getElementById("message-container");
const roomName = window.location.pathname.split("/").pop();
const nickname = prompt("Name ?");

document.getElementById("roomName").innerText = `Room ID :${roomName}`;

appendingMessage("You Joined", "mine");

// socket.emit('new-user' ,nickname)
socket.emit("join-room", roomName, nickname);
socket.on("chat-message", (message) => {
  appendingMessage(message, "other");
});

socket.on("user-connected", (name) => {
  appendingMessage(name + " connected", "other");
});
socket.on("user-disconnected", (name) => {
  appendingMessage(name + " has disconnected", "other");
});

messageInput.addEventListener("input", () => {
  if (messageInput.value) {
    sendBtn.style.display = "inline-block";
    setTimeout(() => (sendBtn.style.opacity = "1"), 250);
  } else {
    sendBtn.style.opacity = "0";
    setTimeout(() => (sendBtn.style.display = "none"), 250);
  }
});

messageForm.addEventListener("submit", (e) => {
  const message = messageInput.value;
  e.preventDefault();
  if (message) {
    socket.emit("send-chat-message", roomName, message);
    appendingMessage(message, "mine");
    messageInput.value = "";
  }
});

function appendingMessage(msg, classname) {
  const message = document.createElement("div");
  message.innerText = msg;
  messageContainer.append(message);
  message.classList.add(classname);
}
