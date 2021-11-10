const express = require("express");
const app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
app.use(express.static("client"));
let vote = 0;
let voterDetail = [];
let rooms = {};

io.on("connection", function (socket) {
  console.log("Your id is " + socket.id);
  socket.on("joinRoom", function (roomName, user) {
    // console.log(roomName, user);
    socket.join(roomName);
    if (!rooms[roomName]) {
      participants = [{ user_id: socket.id, displayName: user }];
      rooms[roomName] = {
        participants,
      };
    } else {
      rooms[roomName]["participants"].push({
        user_id: socket.id,
        displayName: user,
      });
    }
    console.log(JSON.stringify(rooms));
    io.to(roomName).emit("roomInfo", rooms[roomName]);
  });

  socket.on("countOne", function (rName) {
    socket.join(rName);
    var voter = { room: rName, vote: 0 };
    voterDetail.push(voter);
    console.log(voterDetail);
    let obj = voterDetail.find((o) => o.room === rName);
    console.log(obj.room);
    obj.vote = obj.vote + 1;
    console.log(` ${obj.room} has ${obj.vote} votes`);
    io.to(rName).emit("voteOneCounted", obj.vote);
  });

  socket.on("insertPoll", function (roomName, poll) {
    socket.join(roomName)
    if (!rooms[roomName]['polls']) {
      //  unable to figure out
    }
    else {
      rooms[roomName]['polls'].push(poll)
    }
    io.to(roomName).emit("pollAdded",rooms.roomName.polls)
  })

  socket.on("insertVoterId", function(roomName, pollIndex, optionIndex){
    socket.join(roomName);
    rooms[roomName]['polls'][pollIndex]['total_votes'].push(socket.id);
    rooms[roomName]['polls'][pollIndex]['options'][optionIndex]['votes'].push(socket.id);
    io.to(roomName).emit("voterAdded",rooms)
  
  })

  socket.on("disconnect", function () {
    console.log("disconnected");
  });
});

http.listen(3000, function () {
  console.log("listening on localhost:3000");
});
