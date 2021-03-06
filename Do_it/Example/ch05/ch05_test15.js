// < 웹 서버 만들기 : Express 외부 미들웨어 활용하기 >
/*
    라우터 미들웨어 : Express 요청이 들어왔을때 use 메소드가 호출될텐데 
    URL별로 동작을 구분하려면 URL을 확인해서 분기처리해줘야한다. 
    라우터 미들웨어를 사용하면 쉽게 분기할 수 있다.
    -> 라우터 미들웨어는 Express에 기본 포함되어 있다.
    
    * 테스트 *
    GET 방식  : http://127.0.0.1:3000/process/login/?id=SangHo&password=3535
    POST 방식 : http://127.0.0.1:3000/public/login_router.html
    GET Token 방식  : http://127.0.0.1:3000/process/login/PostToken/?id=SangHo&password=3535
    POST Token 방식 : http://127.0.0.1:3000/public/login_router_post_token.html
*/

var express = require("express");
var expressStatic = require("serve-static");
var expressBodyParser = require("body-parser");

var path = require("path");
var http = require("http");

var expressApp = express();

expressApp.use(expressBodyParser.urlencoded({extended: false}));
expressApp.use(expressBodyParser.json());
expressApp.use("/public", expressStatic(path.join(__dirname, "public")));

var ProcessResponse = function(res, id, password)
{
    res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
    res.write("<h1>Express 서버에서 응답한 결과입니다.</h1>");
    res.write("<div><p>Param id : " + id + "</p></div>");
    res.write("<div><p>Param password : " + password + "</p></div>");
    res.end();
};

// 라우터에 패스에 따라 실행될 함수등록
var router = express.Router();
router.route("/process/login").get(function(req, res)
{
    console.log("GET 방식 요청");
    ProcessResponse(res, req.query.id, req.query.password);
});

router.route("/process/login/:id").get(function(req, res)
{
    console.log("GET TOKEN 방식 요청");
    
    // GET 방식으로 req.params에 요청파라미터를 받아낼 수 있다.
    // Router URL : /process/login/:id
    ProcessResponse(res, req.params.id, req.query.password);
});

router.route("/process/login").post(function(req, res)
{
    console.log("POST 방식 요청");
    ProcessResponse(res, req.body.id, req.body.password);
});

router.route("/process/login/:name").post(function(req, res)
{
    console.log("POST TOKEN 방식 요청");
    
    // POST 방식으로도 URL에 요청파라미터를 사용할 수 있다.
    // HTML : <form method="post" action="/process/login/PostToken">
    // Router URL : /process/login/:name
    
    ProcessResponse(res, req.params.name, req.body.password);
});

router.route("/process/login").put(function(req, res)
{
    console.log("PUT 방식 요청");
    ProcessResponse(res, req.body.id, req.body.password);
});

router.route("/process/login").delete(function(req, res)
{
    console.log("DELETE 방식 요청");
    ProcessResponse(res, req.body.id, req.body.password);
});

router.route("*").all(function(req, res)
{
    console.log("ALL(모든요청) 방식 요청");
    res.status(404).send("<h1>ERROR - 페이지를 찾을 수 없습니다.</h1>");
});

// Express 객체에 라우터 등록
expressApp.use("/", router);
expressApp.set("port", process.env.PORT ? process.env.PORT : 3000);

http.createServer(expressApp).listen(expressApp.get("port"), function()
{
    console.log("Express 서버로 시작함");
});