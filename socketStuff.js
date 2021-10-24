const express = require('express');
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
let rooms={}
app.use(express.static('client'))

io.on('connection', function (socket) {
    socket.on("joinRoom", ({ username, room, password }) => {
        let isEntryAvailable = userJoin(socket.id, username, room, password);
        if (isEntryAvailable) {
            socket.emit('passwordFeedback', 'correct',rooms)
        } else {
            socket.emit('passwordFeedback', 'wrong',rooms)
        }
    })
    function userJoin (socketId, username, room, password) {
        if (!rooms[room] || (rooms[room] && !rooms[room].password)) {
            if (!rooms[room]) {
                rooms[room] = {};
            }
            rooms[room].password = password;
            rooms[room][socketId] = username;
            rooms[socketId] = room;
            return true;
        } else {
            if (rooms[room].password == password) {
                rooms[socketId] = room;
                rooms[room][socketId] = username;
                socket.join(room);
                return true;
            } else {
                return false;
            }
        }
    }


   }) 

http.listen(3000, function(){
   console.log('listening on localhost:3000');
});