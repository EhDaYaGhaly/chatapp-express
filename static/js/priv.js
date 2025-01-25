const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("input-field");
const sendBtn = document.getElementById("send-button");
const messageContainer = document.getElementById("message-container");
const NicknameForm = document.getElementById("nickname-form");
let nickname = "";
const chatpage = document.getElementById("chat-page");
chatpage.style.display = "none";
const friendsList = document.getElementById("friends-list");
let selecteduser = "";
let messageStore = {}

socket.on("online-users", (users) => {
  console.log(socket.id);
  friendsList.innerHTML = "";
  friendsList.innerHTML += `
  <li>
    <div class="friend">
      <div class="friend-info">
        <h6>${nickname} (You)</h6>
          <p class="on">Online</p>
       </div>
    </div>
  </li>`;
  users.forEach((user) => {
    console.log(user.userID !== socket.id);
    if (user.userID !== socket.id) {
      friendsList.innerHTML += `
      <li>
        <div class="friend" id="${user.userID}">
          <div class="friend-info" onclick="userOnClickHander('${user.userID}')">
            <div id ='username' class = 'username'>${user.username}<div id='unread'></div></div>
              <p class="online">Online</p>

          </div>
        </div>
      </li>`;
    }
  });
});

socket.on("chat-message", (message,sender) => {
  console.log(message ,sender)
 if(!messageStore[sender]){
   messageStore[sender] = []
 }
  messageStore[sender].push({message,sender:'other'})
  if (selecteduser !== sender) {
    console.log('this is unread')
    const senderDOM = document.getElementById(sender);
    senderDOM.querySelector('#unread').style.display = 'inline-block';
    senderDOM.querySelector('#username').style.fontWeight = 'bold';
  }
  else{
    appendingMessage(message, "other");
  }
});

NicknameForm.addEventListener("submit", (e) => {
  e.preventDefault();
  nickname = document.getElementById("nickname-input").value;
  socket.emit("check-username", nickname);
  
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
    appendingMessage(message, "mine");
    if(!messageStore[selecteduser]){
      messageStore[selecteduser] = []
    }
    messageStore[selecteduser].push({message,sender:'mine'})
    socket.emit("send-chat-message", {content:message,from:socket.id,to:selecteduser});
    messageInput.value = "";
  }
});

function appendingMessage(msg, classname) {
  const message = document.createElement("div");
  message.innerText = msg;
  messageContainer.append(message);
  message.classList.add(classname);
}


function userOnClickHander(userID) {
  selecteduser =userID;
  const senderDOM = document.getElementById(userID);
  senderDOM.querySelector('#unread').style.display = 'none';
  senderDOM.querySelector('#username').style.fontWeight = 'normal';
  messageContainer.innerHTML = "";
  messageStore[userID].forEach((msg) => {
    appendingMessage(msg.message, msg.sender);
  });
}
socket.on('user-exists',()=>{
  alert('User Already Exists')
})
socket.on('username-valid' ,()=>{
  NicknameForm.style.display = "none";
  chatpage.style.display = "flex";
  socket.emit("user-connected", nickname);
})