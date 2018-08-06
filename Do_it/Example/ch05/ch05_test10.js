// < 웹 서버 만들기 : Express의 send 메소드 활용 >
/*
    send([body])는 미들웨어로 응답 데이터를 구성하는 중 즉시 응답 데이터를 보내고 미들웨어를 종료 합니다.
    헤더는 인자에 따라 자동 설정되며, 전달할 수 있는 데이터는 HTML, Buffer, Json, Json Array입니다.
    end와 send의 차이점은 무엇인가?
    end는 write로 구성된 데이터로 응답하고,
    send는 send를 호출할때 파라미터로 응답한다.
*/

var express = require("express");
var expressApp = express();

expressApp.use(function(req, res, next)
{
    console.log("첫 번째 미들웨어에서 요청을 처리함");
    res.send({name:"소녀시대", age:20});
    next();
});

expressApp.use(function(req, res, next)
{
    console.log("두 번째 미들웨어에서 요청을 처리함");
    res.end("<h1>실행안됨</h1>");
});

var http = require("http");
http.createServer(expressApp).listen(3000, function()
{
    console.log("Express 서버 시작됨");
});