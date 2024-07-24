import express from "express";
import path from "path"; //path 모듈 가져옴 -> __dirname 사용 가능.

const __dirname = path.resolve(); //path.resolve()는 node.js를 시작한 파일 기준임.

//라우터 설정.
const router = express.Router();

//http://localhost:port/chat으로 온 get
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/chat/index.html"));
});

//모듈 내보내기.
export default router;
