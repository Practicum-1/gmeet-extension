const express = require('express');
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
let rooms={}
app.use(express.static('client'))
let vote=[0,0,0,0]

io.on('connection', function (socket) {
    socket.on('roomTojoin', function (rName) {
       console.log(rName);
        socket.join(rName)
        socket.emit('roomJoined',rName)
    })
    socket.on('vote1', function (roomForVote) {
        vote[0] = vote[0] + 1
        socket.to(roomForVote).emit('vote1done',vote[0])
    })
    socket.on('vote2', function () {
        vote[1] = vote[1] + 1
        socket.to(roomForVote).emit('vote2done',vote[1])
    })
    socket.on('vote3', function () {
        vote[2] = vote[2] + 1
        socket.to(roomForVote).emit('vote3done',vote[2])
    })
    socket.on('vote4', function () {
        vote[3] = vote[3] + 1
        socket.to(roomForVote).emit('vote4done',vote[3])
    })
   }) 

http.listen(3000, function(){
   console.log('listening on localhost:3000');
});