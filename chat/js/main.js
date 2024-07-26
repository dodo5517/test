const socket = io();
const chatMessages = document.getElementById("chatMessages");

//메세지 받기
socket.on("chatMessage", (msg) => {
  const recievedDiv = document.createElement("div");
  recievedDiv.textContent = msg;
  recievedDiv.className = "message received";
  chatMessages.appendChild(recievedDiv);
});

//메세지 보내기
const sendButton = document.getElementById("sendButton");
sendButton.addEventListener("click", () => {
  const chatInput = document.getElementById("chatInput");
  let msg = chatInput.value;
  console.log(msg);
  if (msg) {
    const sentDiv = document.createElement("div");
    sentDiv.textContent = msg;
    sentDiv.className = "message sent";
    chatMessages.appendChild(sentDiv);
    socket.emit("chatMessage", msg);
    chatInput.value = "";
  }
});
