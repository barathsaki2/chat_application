// const chatBox = document.getElementById('chat-box');
// const messageInput = document.getElementById('message');

// const socket = new WebSocket('ws://localhost:3000');

// socket.addEventListener('open', function (event) {
//     console.log('Connected to server');
// });

// socket.addEventListener('message', function (event) {
//     const message = event.data;
//     appendMessage(message);
// });

// function sendMessage() {
//     const message = messageInput.value;
//     if (message.trim() !== '') {
//         socket.send(message);
//         messageInput.value = '';
//         appendMessage('You: ' + message);
//     }
// }

// function appendMessage(message) {
//     const messageElement = document.createElement('div');
//     messageElement.innerText = message;
//     chatBox.appendChild(messageElement);
// }
// Initialize WebSocket connection
const socket = new WebSocket('ws://localhost:3000');

let activePerson = 'john'; // Default active person

// Function to handle incoming messages
socket.onmessage = function(event) {
  const message = JSON.parse(event.data);
  if (message.sender === activePerson) {
    displayMessage(message);
  }
};

// Function to send messages
function sendMessage(message) {
  socket.send(JSON.stringify(message));
}

// Function to display messages
function displayMessage(message) {
  const chatMsgElement = document.querySelector('.chat-msg');
  const newMessageElement = document.createElement('div');
  newMessageElement.classList.add('message', message.sender === 'john' ? 'blue-bg' : 'gray-bg');
  newMessageElement.innerHTML = `
    <div class="message-sender">${message.sender}</div>
    <div class="msg-text">${message.text}</div>
    <div class="msg-time">${message.time}</div>
  `;
  chatMsgElement.appendChild(newMessageElement);
}

// Function to handle form submission
document.querySelector('.chat-input').addEventListener('submit', function(event) {
  event.preventDefault();
  const inputElement = document.querySelector('.chat-in');
  const messageText = inputElement.value.trim();
  if (messageText !== '') {
    const message = {
      sender: activePerson,
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    sendMessage(message);
    displayMessage(message); // Display message sent by the active person
    inputElement.value = ''; // Clear input field after sending message
  }
});

// Function to switch active person
document.querySelectorAll('.person-selector-button').forEach(button => {
  button.addEventListener('click', function() {
    activePerson = this.id; // Switch active person based on button id
    document.querySelectorAll('.person-selector-button').forEach(btn => {
      btn.classList.remove('active-person');
    });
    this.classList.add('active-person');
    document.querySelector('.chat-header').textContent = `${activePerson} chatting`;
  });
});

// Function to handle clear chat button
document.querySelector('.clear-chat-button').addEventListener('click', function() {
  document.querySelector('.chat-msg').innerHTML = '';
});

