const path = require('path');
const http = require('http');
const express = require('express');
const socket = require('socket.io');
const wrapMessage = require('./objects/messages');
const {addUser, getUserById, deleteUser, getUsersInRoom} = require('./objects/users');

//Setting express app and socket.io
const app = express();
const server = http.createServer(app);
const io = socket(server);

//Setting static files
app.use(express.static(path.join(__dirname, 'public')));

//On connection
io.on('connection', socket => {
    //On user join
    socket.on('user-join', ({username, room}) => {
        addUser(socket.id, username, room);
        socket.join(room);
        
        //Welcome message
        socket.emit('bot-message', `${username}, welcome to CroakRoom !! This is the ${room} room.`);
        socket.broadcast.to(room).emit('bot-message', `${username} has joined the chat !!`);

        //Update users and room
        io.to(room).emit('update-sidebar', {
            room: room,
            users: getUsersInRoom(room)
        });
    });   

    //On message
    socket.on('chat-message', (message) => {
        const user = getUserById(socket.id);
        socket.broadcast.to(user.room).emit('message-others', wrapMessage(user.username, message));
        socket.emit('message-user', wrapMessage(user.username, message));
    });

    //On room leave
    socket.on('disconnect', () => {
        const user = deleteUser(socket.id);
        if (user) {
            io.to(user.room).emit('bot-message', `${user.username} has left the chat.`);
        }

        //Update sidebar
        io.to(user.room).emit('update-sidebar', {
            room: user.room,
            users: getUsersInRoom(user.room)
        });
    });
});

const port = process.env.PORT || 3000;

server.listen(port, () => console.log(`Server running on port ${port}`));