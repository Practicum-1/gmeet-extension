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
    // console.log(JSON.stringify(rooms));
    console.log(rooms[roomName])
    // console.log(rooms[roomName]['participants'])
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
// event 1 will check if a poll with a given index already exist or not 
  socket.on("event1", function (pollIndex) {
    
    if (!rooms[roomName]) {
      polls = [{
        index: pollIndex,
        textString: "question",
        options: [],
        createdBy: socket.id,
        createdAt: Date.now(),}]
        room[roomName]={polls,}
    }
    else {
      rooms[roomName]["polls"].push({
        index: pollIndex,
        textString: "polling question",
        options: [],
        createdBy: socket.id,
        createdAt: Date.now(),
        
      })
    }
    rooms[roomName]['polls'][pollIndex]['options'].push({
      option: 'option A',
      votes:[]
    })
    rooms[roomName]['polls'][pollIndex]['options'].push({
      option: 'option B',
      votes:[]
    })
    rooms[roomName]['polls'][pollIndex]['options'].push({
      option: 'option C',
      votes:[]
    })
    rooms[roomName]['polls'][pollIndex]['options'].push({
      option: 'option D',
      votes:[]
    })
    
  })
  
  // event 2 will pass the socket id to votes key of the respective option of the respective poll
  socket.on("event2", function (pollIndex, optionIndex) {
    
    rooms[roomName]['polls'][pollIndex]['options'][optionIndex]['votes'].push(socket.id);


  })

  socket.on("disconnect", function () {
    console.log("disconnected");
  });
});

http.listen(3000, function () {
  console.log("listening on localhost:3000");
});
