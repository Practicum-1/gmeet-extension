var socket = io();
const roomName=document.getElementById('roomName')
const uname=document.getElementById('identity')
const password=document.getElementById('pass')

socket.on(' connect', () => {
   console.log('Connected', socket.id);
})
function checkPass() {
   // const roomName=document.getElementById('roomName')
   // const uname=document.getElementById('identity')
   // const password = document.getElementById('pass')
   socket.emit('tryFill',{ room: roomName, username: uname, password: password})
      socket.emit('joinRoom', { room: roomName, username: uname, password: password});
      socket.on('passwordFeedback', function (letter,roomInf) {
       console.log(roomInf);
         roomInfo.innerHTML = ` <li>You have entered ${letter} password</li> <li></li>`
      })
   }
