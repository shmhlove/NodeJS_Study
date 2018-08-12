// < 웹 서버 만들기 : Express 외부 미들웨어 활용하기 >
/*
    에러처리 미들웨어
    -> npm install express-error-handler --save
    
    * 테스트 *
    http://127.0.0.1:3000/login
*/

var express = require("express");
var expressStatic = require("serve-static");
var expressErrorHandler = require("express-error-handler");

var path = require("path");
var http = require("http");
var fs = require("fs");

var expressApp = express();
expressApp.use("/", expressStatic(path.join(__dirname, "public")));

// 라우터에 패스에 따라 실행될 함수등록
var router = express.Router();
router.route("*").all(function(req, res)
{
    console.log("ALL(모든요청) 방식 요청");
    
    // 음... 이렇게 해도 되는데 error-handler를 쓰는구나.. 뭔가 이유가 있겠지??
    fs.readFile("./Example/ch05/public/404.html", "utf8", function(err, data)
    {
        res.status(404).send(data);
    });
});

// Express 객체에 에러 핸들러 등록
var errorHandler = expressErrorHandler(
    {
        static: 
        {
            "404": "./Example/ch05/public/404.html"
        }
    }
);
expressApp.use(expressErrorHandler.httpError(404));
expressApp.use(errorHandler);

// Express 객체에 라우터 등록
expressApp.use("/", router);
expressApp.set("port", process.env.PORT ? process.env.PORT : 3000);

http.createServer(expressApp).listen(expressApp.get("port"), function()
{
    console.log("Express 서버로 시작함");
});