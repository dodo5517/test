import express from "express";
import path from "path"; //path 모듈 가져옴 -> __dirname 사용 가능.

const __dirname = path.resolve(); //path.resolve()는 node.js를 시작한 파일 기준임.

//라우터 설정.
const router = express.Router();

//http://localhost:port/chat으로 온 get
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/chat/index.html"));
});
//css나 js는 변하지 않는 내용이니 정적 파일로 보냄.express.static을 사용하면 서버가 아닌 클라이언트쪽에서 처리함.
router.use("/css", express.static(path.join(__dirname, "/chat/css")));
router.use("/js", express.static(path.join(__dirname, "/chat/js")));

//모듈 내보내기.
export default router;
