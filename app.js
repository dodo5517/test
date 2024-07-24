const express = require("express"); //express 가져옴
const app = express(); //express 인스턴스 생성
const port = 3000; //3000번에서 열거임.

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(port, () => {
  console.log(`
    ###############################################
           Server listening on port: ${port}
    ###############################################
    `);
});
