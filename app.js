import express from "express"; //express 모듈 가져옴
import path from "path"; //path 모듈 가져옴 -> __dirname 사용 가능.

const app = express(); //express 인스턴스 생성
const port = 3000; //3000번에서 열거임.
const __dirname = path.resolve(); //절대 경로 저장.

import chatRouter from "./chat/chat.js"; //라우터로 분리한 라우터모듈을 가져옴.

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.use("/chat", chatRouter); // http://localhost:port/chat으로 오는 모든 요청(use)은 chatRouter가 처리할 거임.

app.listen(port, () => {
  console.log(`
    ###############################################
    Server listening on port: ${port}
    ###############################################
    `);
});

// console.log("dirname : " + __dirname);
