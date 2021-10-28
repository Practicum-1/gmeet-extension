const express = require('express');
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use(express.static('client'))
let vote = 0;
let rooms=[]
io.on('connection', function (socket) {
console.log("Your id is "+ socket.id);
    socket.on('joinRoom', function (roomName,msg) {
        socket.join(roomName)
        console.log(msg);
        io.to(roomName).emit('showMessage',msg)
    })
    socket.on('countOne', function (rName) {
        const roomAlready = rooms.includes(rName);
        socket.join(rName)
        if (roomAlready == true) {
            vote = vote + 1;
        }
        else
        {
            rooms.push(rName)
            vote = 0
            vote=vote+1
            }
        console.log(rooms);
        // vote = vote + 1;
        io.to(rName).emit('voteOneCounted',vote)
    })
})

http.listen(3000, function(){
    console.log('listening on localhost:3000');
 });