// < 웹 서버 만들기 : Express 미들웨어 간 데이터 공유 >
/*
    use를 이용해서 미들웨어를 만들면 request요청이 왔을때 호출이된다.
    여러개의 미들웨어가 있을때 next를 이용해서 다음 미들웨어로 스레드를 넘길 수 있다.
    end나 send를 호출하면 클라이언트에 응답을 하고, 미들웨어 호출이 종료된다.
*/

var express = require("express");
var expressApp = express();

expressApp.use(function(req, res, next)
{
    console.log("첫 번째 미들웨어에서 요청을 처리함");
    
    req.user = "SangHo";
    
    res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
    
    next();
});

expressApp.use(function(req, res, next)
{
    console.log("두 번째 미들웨어에서 요청을 처리함");
    
    res.end("<h1>Express 서버에서 " + req.user + "가 응답한 결과입니다.</h>");
});

var http = require("http");
http.createServer(expressApp).listen(3000, function()
{
    console.log("Express 서버가 3000번 포트에서 시작됨");
});