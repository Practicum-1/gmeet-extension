const express = require("express");
const app = express();
var io = require("socket.io")(app);
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

app.get("/", function (req, res) {
  res.send("Server running");
});

//CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
  );
  res.header("Access-Control-Allow-Credentials", true);
  next(); // dont forget this
});

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
      polls = [];
      rooms[roomName] = {
        participants,
        polls,
      };
    } else {
      rooms[roomName]["participants"].push({
        user_id: socket.id,
        displayName: user,
      });
    }
    console.log(JSON.stringify(rooms));
    io.to(roomName).emit("roomInfo", {
      roomName,
      participants: rooms[roomName]["participants"],
      polls: rooms[roomName]["polls"],
    });
  });

  socket.on("insertPoll", function (roomName, poll) {
    socket.join(roomName);
    rooms[roomName]["polls"].push(poll);
    console.log(rooms);
    io.to(roomName).emit("pollAdded", rooms[roomName]["polls"]);
  });

  socket.on("insertVoterId", function (roomName, pollIndex, optionIndex) {
    socket.join(roomName);
    rooms[roomName]["polls"][pollIndex]["total_votes"].push(socket.id);
    rooms[roomName]["polls"][pollIndex]["options"][optionIndex]["votes"].push(
      socket.id
    );
    io.to(roomName).emit("voterAdded", rooms[roomName]["polls"]);
  });

  socket.on("disconnect", function () {
    console.log("disconnected");
    console.log(socket.id, " disconnected");
  });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
