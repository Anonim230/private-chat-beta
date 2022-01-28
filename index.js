// Imports

const express = require('express');
const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const db = require('./modules/db');

// Constants

const app = express()
const server = app.listen(9000, () => console.log('Server is running on 9000'))
const io = socketIO(server)
const DB = new db({
    messages: './database/messages.json',
    users: './database/users.json'
})
const SECRET_KEY = "VERY SECRET KEY"
app.use(express.static('public'))

var users = DB.read('users')
var users_socket_ids = []
    // A-ranked tasks

io.on('connection', socket => {
    let messages = DB.read('messages')
    socket.on('new-user', data => {
        users_socket_ids[[data.user]] = socket.id
        if (!(data && data.user)) return false;
        socket.emit('get-user-list', Object.keys(users_socket_ids))
        socket.broadcast.emit('get-user-list', Object.keys(users_socket_ids))
        socket.broadcast.emit("I'm_here!!!", data.user)
        if (!data.token) socket.emit('get-token', jwt.sign(data.user, SECRET_KEY))
    })
    socket.on('message', data => {
        // console.log(data, data.to, users_socket_ids[data.to]);
        if (!users_socket_ids[data.to] && data.to !== 'All Users') return false
        messages.push(data)
        if (data.to === 'All Users') socket.broadcast.emit('new-message', data)
        else {
            socket
                .broadcast
                .to(users_socket_ids[data.to])
                .emit('new-message', data)
        }
        DB.write('messages', messages)
    })
    socket.on('send-messages', user => {
        console.log(user);
        let filtered_messages = messages.filter(message => socket.id === message.from || user === message.to)
        console.log(filtered_messages);
        socket.to(socket.id).emit('get-messages', filtered_messages)
    })
    socket.on('disconnect', () => {
        users_socket_ids = Object.fromEntries(Object.entries(users_socket_ids).filter(client => client[1] != socket.id))
            // console.log(users_socket_ids);
        socket.broadcast.emit('get-user-list', Object.keys(users_socket_ids))
    })
});


// B-ranked tasks

console.log('Working');