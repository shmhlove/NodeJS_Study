// < 웹 서버 만들기 : Express 서버 만들기 >

var express = require("express");
var http = require("http");

var expressApp = express();
expressApp.set("port", process.env.PORT ? process.env.PORT : 3000);

http.createServer(expressApp).listen(expressApp.get("port"), function()
{
    console.log("익스프레스 서버를 시작했습니다.");
});