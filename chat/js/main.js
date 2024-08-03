const socket = io();
//구글 공개 stun 사용.
const configuration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};
//webrtc연결
const peerConnection = new RTCPeerConnection(configuration);

// 데이터 채널 설정
function setupDataChannel() {
  dataChannel.onopen = () => {
    console.log("Data channel is open");
  };

  //채널에 메세지가 오면 이벤트 발생.(채널이 살아있는 한 계속 호출 가능.)
  //채널이 새로 만들어질 때마다 이벤트를 재설정 하는데 일관된 이벤트를 위해 setupDataChannel() 함수에 같이 넣음.
  dataChannel.onmessage = (event) => {
    const recievedDiv = document.createElement("div");
    recievedDiv.textContent = event.data;
    recievedDiv.className = "message received";
    chatMessages.appendChild(recievedDiv);
  };
}

// Offer를 생성하고 전송
async function createOffer() {
  //chat 채널 생성
  dataChannel = peerConnection.createDataChannel("chat");
  setupDataChannel();

  //상대에게 보낼 offer 생성.
  const offer = await peerConnection.createOffer();
  //만든 offer 발신을 위해 localDescription 설정.
  await peerConnection.setLocalDescription(offer);
  //(시그널링)서버에 sdp offer 보냄.
  socket.emit("sdp", { description: peerConnection.localDescription });
}

//서버로 부터 sdp offer/answer 받음.
socket.on("sdp", (data) => {
  //받은 sdp에 description(offer/answer)이 있으면
  if (data.description) {
    //RTC 세션 설명 객체 생성
    const remoteDesc = new RTCSessionDescription(data.description);
    //상대의 세션 설명을 자신의 원격 설명에 저장함.
    peerConnection.setRemoteDescription(remoteDesc);
    //만약 sdp offer를 받은 거라면
    if (remoteDesc.type == "offer") {
      //상대에게 수신할 answer 생성.
      const answer = peerConnection.createAnswer();
      //자신의 로컬 설명에 answer 저장함.
      peerConnection.setLocalDescription(answer);
      //서버에 answer 보냄. 정해진 객체로 묶어야 제대로 description을 구성할 수 있나봄.
      socket.emit("sdp", { description: peerConnection.localDescription });
    }
  }
});

// ICE 후보가 발견될 때마다 이벤트 발생.
peerConnection.onicecandidate = (e) => {
  //발견되면 서버로 보냄.
  if (e.candidate) {
    //정해진 객체로 묶어야 제대로 ice를 구성할 수 있나봄.
    socket.emit("ice-candidate", { candidate: e.candidate });
  }
};

//상대가 데이터 채널을 생성하면
peerConnection.ondatachannel = (event) => {
  //새로만든 데이터 채널에 접근을 위해 업데이트함.
  dataChannel = event.channel;
  setupDataChannel();
};

//ice cnadidiate에 대한 이벤트
socket.on("ice-candidate", (data) => {
  if (data.candidate) {
    peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
  }
});

const chatMessages = document.getElementById("chatMessages");
const sendButton = document.getElementById("sendButton");

//보내기 버튼에 대한 이벤트
sendButton.addEventListener("click", () => {
  const chatInput = document.getElementById("chatInput");
  let msg = chatInput.value;
  console.log(msg);
  if (msg) {
    dataChannel.send(msg); //채널에 메세지 전송.
    const sentDiv = document.createElement("div");
    sentDiv.textContent = msg;
    sentDiv.className = "message sent";
    chatMessages.appendChild(sentDiv);
    chatInput.value = "";
  }
});
createOffer();

//이 밑은 socket.io로 메세지 주고 받기.
//메세지 받기
// socket.on("chatMessage", (msg) => {
//   const recievedDiv = document.createElement("div");
//   recievedDiv.textContent = msg;
//   recievedDiv.className = "message received";
//   chatMessages.appendChild(recievedDiv);
// });

// //메세지 보내기
// sendButton.addEventListener("click", () => {
//   const chatInput = document.getElementById("chatInput");
//   let msg = chatInput.value;
//   console.log(msg);
//   if (msg) {
//     const sentDiv = document.createElement("div");
//     sentDiv.textContent = msg;
//     sentDiv.className = "message sent";
//     chatMessages.appendChild(sentDiv);
//     socket.emit("chatMessage", msg);
//     chatInput.value = "";
//   }
// });
