const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

const socket = io();

//Get username and room from URL (Query parsing)
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true});

//Emit user-join when a new user joins
socket.emit('user-join', {username, room});

//Catch message to update sidebar
socket.on('update-sidebar', ({room, users}) => {
    updateRoom(room);
    updateUsers(users);
});

//catch message by bot/admin
socket.on('bot-message', (alert) =>{
    outputBotMessage(alert);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Catch message by others
socket.on('message-others', (message_object) =>{
    outputMessageOthers(message_object);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Catch message by user
socket.on('message-user', (message_object) =>{
    outputMessageUser(message_object);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Emit message on pressing 'send' button
chatForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = document.getElementById('msg').value;
    socket.emit('chat-message', message);

    //clear input and focus on it
    document.getElementById('msg').value = '';
    document.getElementById('msg').focus();
});

//DOM manipulation - Display bot message
function outputBotMessage(alert) {
    let div = document.createElement('div');
    div.classList.add('bot-message');
    div.innerHTML = `<p class="text"> ${alert} </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

//DOM manipulation - Display message by others
function outputMessageOthers(message_object) {
    let div = document.createElement('div');
    div.classList.add('message-others');
    div.innerHTML = `
    <p class="meta">${message_object.username} <span>${message_object.time}</span></p>
    <p class="text">
        ${message_object.message}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

//DOM manipulation - Display message by user
function outputMessageUser(message_object) {
    let div = document.createElement('div');
    div.classList.add('message-user');
    div.innerHTML = `
    <p class="meta">${message_object.username} <span>${message_object.time}</span></p>
    <p class="text">
        ${message_object.message}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

//DOM manipulation - Sidebar update (room name)
function updateRoom(room) {
    document.getElementById('room-name').innerText = room;
}

//DOM manipulation - Sidebar update (users)
function updateUsers(users) {
    const userList = document.getElementById('users');
    userList.innerHTML = '';
    for(let i = 0; i < users.length; i++) {
        let li = document.createElement('li');
        li.innerText = `${users[i].username}`;
        userList.appendChild(li);
    }
}