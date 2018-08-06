// < 웹 서버 만들기 : Express에서 클라이언트 요청 객체(res)에 추가한 헤더와 파라미터 확인해보기 >
/*
    query : 클라이언트에서 GET 방식으로 전송한 요청 파라미터
    body : 클라이언트에서 POST 방식으로 전송한 요청 파라미터
    header(name) : 헤더
    
    파라미터를 이렇게 쉽게 확인할 수 있다니...
    ch04_test1.js를 확인해보면 차이점을 알 수 있다.
    
    Get방식으로 요청 : http://127.0.0.1:3000/?name=SangHo
*/

var express = require("express");
var expressApp = express();

expressApp.use(function(req, res, next)
{
    console.log("첫 번째 미들웨어에서 처리함");
    
    var userAgent = req.header("User-Agent");
    var paramName = req.query.name;
    
    res.writeHead(200, {"Content-Type": "text/html;charset=utf8"});
    res.write("<h1>Express 서버에서 응답한 결과입니다.</h1>");
    res.write("<div><p>User-Agent : " + userAgent + "</p></div>");
    res.write("<div><p>Param name : " + paramName + "</p></div>");
    res.end();
});

var http = require("http");
http.createServer(expressApp).listen(3000, function()
{
    console.log("Express 서버로 시작함");
});