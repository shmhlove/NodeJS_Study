// < 웹 서버 만들기 : Express의 redirect 메소드 활용 >
/*
    redirect([status,] path)는 웹 페이지 경로를 강제로 이동시킵니다.
*/

var express = require("express");
var expressApp = express();

expressApp.use(function(req, res, next)
{
    res.redirect("http://google.co.kr");
});

var http = require("http");

http.createServer(expressApp).listen(3000, function()
{
    console.log("Express 서버로 시작함");
});