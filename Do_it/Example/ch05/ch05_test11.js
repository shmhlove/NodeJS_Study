// < 웹 서버 만들기 : Express의 status, sendStatus 메소드 활용 >
/*
    status와 sendStatus는 HTTP 상태 코드를 클라이언트에 반환합니다.
    HTTP 상태코드에는 200, 403, 505등 지정된 의미를 가진 코드가 존재합니다.
    보통 에러발생시 사용됩니다.
*/

var express = require("express");
var expressApp = express();

expressApp.use(function(req, res, next)
{
    console.log("첫 번째 미들웨어로 처리됨");
    
    //res.status(403).send("Forbidden");
    // same to up and down
    res.sendStatus(403);
});

var http = require("http");
http.createServer(expressApp).listen(3000, function()
{
    console.log("Express 서버로 시작됨");
});