var socket = io();
// const roomName=document.getElementById('roomName')
// const uname=document.getElementById('identity')
// const password=document.getElementById('pass')
const showButtons = document.getElementById("btn");
const roomInfo = document.getElementById("roomInfo");
socket.on(" connect", () => {
  console.log("Connected", socket.id);
});
function joinRoom() {

const roomName = document.getElementById("roomName").value;
  socket.emit("roomTojoin", roomName);
}
socket.on("roomJoined", function (roName) {
  roomInfo.innerHTML = "You are now in " + roName;
  showButtons.style.display = "block";
});
function vote1() {
  socket.emit("vote1",roomName);
  socket.on("vote1done", function (vote1Value) {
    document.getElementById("vote1Value").innerHTML = vote1Value;
  });
}
function vote2() {
  socket.emit("vote2",roomName);
  socket.on("vote2done", function (vote2Value) {
    document.getElementById("vote2Value").innerHTML = vote2Value;
  });
}
function vote3() {
  socket.emit("vote3",roomName);
  socket.on("vote3done", function (vote3Value) {
    document.getElementById("vote3Value").innerHTML = vote3Value;
  });
}
function vote4() {
  socket.emit("vote4",roomName);
  socket.on("vote4done", function (vote4Value) {
    document.getElementById("vote4Value").innerHTML = vote4Value;
  });
}
