// < 웹 서버 만들기 : Express 미들웨어 만들기 >
/*
    use를 이용해서 미들웨어를 만들면 request요청이 왔을때 호출된다.
    웹 요청에 대한 응답은 한번만 할 수 있고, 그 한번에는 여러가지 의미를 가진 데이터가 포함된다.
    미들웨어의 역할은 여러 의미를 가진 데이터를 모듈화하여 독립적인 응답을 구성할 수 있도록 해준다.
*/

var express = require("express");
var expressApp = express();

expressApp.use(function(req, res, next)
{
    console.log("첫 번째 미들웨어에서 요청을 처리함");
    
    res.writeHead(200, {"Content-Type": "text/html;charset=utf8"});
    res.end("<h1>Express 서버에서 응답한 결과입니다.</h1>");
});

var http = require("http");
http.createServer(expressApp).listen(3000, function()
{
    console.log("Express 서버가 3000번 포트에서 시작됨");
});