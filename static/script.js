const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('input-field')
const sendBtn = document.getElementById('send-button')
const messageContainer = document.getElementById('message-container')


var i = 0
const nickname = prompt('Name ?')
appendingMessage('You Joined' , 'mine')
socket.emit('new-user' ,nickname)

socket.on('chat-message' , message => {
    console.log(message)
    appendingMessage(message , 'other')
})

socket.on('user-connected' , name => {
    appendingMessage(name + ' connected' , 'other')
})

messageInput.addEventListener('input' , ()=>{
    if(messageInput.value)
       {sendBtn.style.display = 'inline-block'
        setTimeout(() =>sendBtn.style.opacity = '1', 250);
        }
   
    else
       {sendBtn.style.opacity = '0'
        setTimeout(() =>sendBtn.style.display = 'none', 250);}
    
})




messageForm.addEventListener('submit' , (e)=> {
    const message = messageInput.value
    e.preventDefault()
    if(messageInput.value)
    {socket.emit('send-chat-message' , message)
        appendingMessage(messageInput.value , 'mine')
    messageInput.value = ''
}

})



function appendingMessage(msg , classname) {
    const message  = document.createElement('div')
    message.innerText = msg
    messageContainer.append(message)
    message.classList.add(classname);
}