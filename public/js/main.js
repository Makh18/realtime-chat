const chatForm=document.getElementById("chat-form");
const chatMessage=document.querySelector('.chat-messages');
const roomName=document.getElementById('room-name');
const userList=document.getElementById('users');
//get username and a room from URL
const {username, room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true
});
console.log(username, room);
const socket=io();

//join chatRoom
socket.emit('joinRoom',{username,room});
//get room and users
socket.on('roomUsers',({room,users}) =>{
    outputRoomName(room);
    outputUsers(users);
});
//Message from server
socket.on('message',message=>{
    console.log(message);
 outputMessage(message);
 //scroll down
chatMessage.scrollTop=chatMessage.scrollHeight;
});
chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    //get msg from user
    const msg=e.target.elements.msg.value;
    console.log(msg);
    //emit msg to server
    socket.emit('chatMessage', msg);
    //clear input
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();

});
function outputMessage(message){
  const div=document.createElement('div');
  div.classList.add('message');
   div.innerHTML=`<p class="meta">${message.username}<span>${message.time}</span></p>
   <p class="text">
        ${message.text}
   </p>`;
   document.querySelector('.chat-messages').appendChild(div);
}
//add room name to dom
function outputRoomName(room){
    roomName.innerText=room;
}
//Add users to dom
function outputUsers(users){
    userList.innerHTML=`
    ${users.map(user=>`<li>${user.username}</li>`).join('')}
    `;
}