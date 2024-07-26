import express from "express"; //express 모듈 가져옴
import path from "path"; //path 모듈 가져옴 -> __dirname 사용 가능.
import { createServer } from "http";
import { Server } from "socket.io";

const app = express(); //express 인스턴스 생성
const port = 3000; //3000번에서 열거임.
const httpServer = createServer(app); //http 서버 생성

const __dirname = path.resolve(); //절대 경로 저장.

import chatRouter from "./chat/chat.js"; //라우터로 분리한 라우터모듈을 가져옴.

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.use("/chat", chatRouter); // http://localhost:port/chat으로 오는 모든 요청(use)은 chatRouter가 처리할 거임.

//웹소켓 서버 생성
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:" + port,
  },
});

let user = {};

//연결하면
io.on("connection", (socket) => {
  console.log("새로운 사용자가 연결되었습니다.");
  user[socket.id] = {
    id: socket.id,
  };

  //클라이언트에서 보낸 이벤트 수신 및 처리
  socket.on("chatMessage", (msg) => {
    console.log("수신한 메시지:", msg);
    // 자신을 제외한 클라이언트 모두에게 메시지 전송
    socket.broadcast.emit("chatMessage", msg);
  });

  //연결을 끊는다면
  socket.on("disconnect", () => {
    console.log("A user disconnected");
    delete user[socket.id];
    console.log(user);
  });
});

httpServer.listen(port, () => {
  console.log(`
    ###############################################
            Server listening on port: ${port}
    ###############################################
         `);
});
// console.log("dirname : " + __dirname);
