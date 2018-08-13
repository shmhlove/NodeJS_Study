// < 5장 도전과제 1 >
// 메모를 기록하여 웹 서버로 보내는 기능을 만들어 보세요.
// http://127.0.0.1:3000/public/memo.html

var express = require("express");
var expressStatic = require("serve-static");
var expressBodyParser = require("body-parser");

var path = require("path");
var http = require("http");

var expressApp = express();

expressApp.use(expressBodyParser.urlencoded({extended: false}));
expressApp.use(expressBodyParser.json());
expressApp.use("/public", expressStatic(path.join(__dirname, "public")));

// 라우터에 패스에 따라 실행될 함수등록
var router = express.Router();
router.route("/process/memo").post(function(req, res)
{
    console.log("POST 방식 요청");
    
    console.log("작성자 : " + req.body.user + ", " + "작성일 : " + req.body.date + ", " + "메모 : " + req.body.memo);
    
    res.writeHead(200, {"Content-Type": "text/html;charset=utf8"});
    res.write("<p>나의 메모</p>");
    res.write("<hr/>");
    res.write("<p>메모가 저장되었습니다.</p>");
    res.write("<p>memo : " + req.body.memo + "</p>");
    res.write("<a href=\"/public/memo.html\">다시 작성</a>");
    res.end();
});

// Express 객체에 라우터 등록
expressApp.use("/", router);
expressApp.set("port", process.env.PORT ? process.env.PORT : 3000);

http.createServer(expressApp).listen(expressApp.get("port"), function()
{
    console.log("Express 서버로 시작함");
});