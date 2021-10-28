var socket = io();
let roomName = prompt("Enter name of room")
document.getElementById('btn').addEventListener("click", submitMessage)
document.getElementById('optionOne').addEventListener('click', countVoteOne)

document.getElementById('roomInfo').innerHTML=`You are now in ${roomName}  room  <br>`
socket.on('connect', function () {
    console.log("You are now connected  ");
})

function submitMessage(){
    let msgText= document.getElementById('msg').value
    socket.emit('joinRoom', roomName, msgText)

}

function countVoteOne() {
    socket.emit('countOne',roomName)
}

socket.on('voteOneCounted', function (vote) {
    console.log("one is pressed "+vote);
    document.getElementById('voteOneValue').innerHTML= `Button is pressed ${vote} times`
})


socket.on('showMessage', function (message) {
    console.log(message);
    document.getElementById('msgText').innerHTML=`<lli> ${message} </li>`
})