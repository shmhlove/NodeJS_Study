// < 웹 서버 만들기 : Express 외부 미들웨어 활용하기 >
/*
    static 미들웨어 : 서버 내 특정 폴더의 파일들을 URL 패스로 웹페이지에서 바로 접근할 수 있도록 만들어준다.
        -> npm install serve-static --save
        
    body-parser 미들웨어 : POST 로 요청했을 때 body에 들어오는 요청 파라미터를 쉽게 확인할 수 있도록 만들어준다.
        -> npm install body-parser --save

    * 테스트 *
    GET 방식  : http://127.0.0.1:3000/?id=SangHo&password=3535
    POST 방식 : http://127.0.0.1:3000/public/login.html
*/

var express = require("express");
var expressStatic = require("serve-static");
var expressBodyParser = require("body-parser");

var path = require("path");
var http = require("http");

var expressApp = express();
expressApp.set("port", process.env.PORT ? process.env.PORT : 3000);

// body-parser를 사용해서 application/x-www-form-urlencoded 형식으로 전달된 요청을 파싱할 수 있게 설정한다.
// -> application/x-www-form-urlencoded는 ch05_test6.js에서 
//    http를 이용해 POST방식으로 다른 웹사이트에서 데이터를 가져올때 헤더 옵션으로 사용한적이 있음
expressApp.use(expressBodyParser.urlencoded({extended: false}));

// body-parser를 사용해서 application/json 형식으로 전달된 요청을 파싱할 수 있게 설정한다.
expressApp.use(expressBodyParser.json());

// serve-static를 사용해서 이 폴더에 있는 public폴더를 /public 이벤트와 매칭시킴
expressApp.use("/public", expressStatic(path.join(__dirname, "public")));

expressApp.use(function(req, res, next)
{
    console.log("첫 번째 미들웨어에서 요청을 처리함");
    
    // body-parser로 인해 id 필드에 접근할 수 있다.
    var paramId = req.body.id ? req.body.id : req.query.id;
    //  body-parser로 인해 password 필드에 접근할 수 있다.
    var paramPassword = req.body.password ? req.body.password : req.query.password;
    
    res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
    res.write("<h1>Express 서버에서 응답한 결과입니다.</h1>");
    res.write("<div><p>Param id : " + paramId + "</p></div>");
    res.write("<div><p>Param password : " + paramPassword + "</p></div>");
    res.end();
});

http.createServer(expressApp).listen(expressApp.get("port"), function()
{
    console.log("Express 서버로 시작함");
});