const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

app.get("/", function (req, res) {
  res.send("Server running");
});

const port = process.env.PORT || 4000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

var io = require("socket.io")(server);

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

let rooms = {};
let users = {};

io.on("connection", function (socket) {
  console.log("Your id is " + socket.id);
  socket.on("joinRoom", function (roomName, user) {
    socket.join(roomName);
    users[socket.id] = { roomName, displayName: user };
    if (!rooms[roomName]) {
      participants = [{ user_id: socket.id, displayName: user }];
      polls = [];
      inactiveUsers = [];
      rooms[roomName] = {
        participants,
        polls,
        inactiveUsers,
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

  socket.on("disconnecting", function () {
    console.log(socket.id, " disconnected");
    if (users[socket.id]) {
      const roomName = users[socket.id]["roomName"];
      rooms[roomName].inactiveUsers.push(users[socket.id]["displayName"]);
      console.log(rooms);
    }
  });
});

setInterval(() => {
  if (Object.keys(rooms).length > 0) {
    Object.keys(rooms).forEach((roomName) => {
      console.log("ran");
      io.to(roomName).emit("roomInfo", rooms[roomName]);
    });
  }
}, 30000);
