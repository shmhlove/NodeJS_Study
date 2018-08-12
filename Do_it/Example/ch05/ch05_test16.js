// < 웹 서버 만들기 : Express 외부 미들웨어 활용하기 >
/*
    에러처리 미들웨어
    -> npm install express-error-handler --save
    
    * 테스트 *
    http://127.0.0.1:3000/login
*/

var express = require("express");
var expressStatic = require("serve-static");
var expressBodyParser = require("body-parser");
var expressErrorHandler = require("express-error-handler");

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
    var paramName = req.params.name;
    ProcessResponse(res, paramName, req.body.password);
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

var fs = require("fs");
router.route("*").all(function(req, res)
{
    console.log("ALL(모든요청) 방식 요청");
    
    // 음... 이렇게 해도 되는데 error-handler를 쓰는구나.. 뭔가 이유가 있겠지??
    fs.readFile("./Example/ch05/public/404.html", "utf8", function(err, data)
    {
        res.status(404).send(data);
    });
});

// Express 객체에 라우터 등록
expressApp.use("/", router);
expressApp.set("port", process.env.PORT ? process.env.PORT : 3000);

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

http.createServer(expressApp).listen(expressApp.get("port"), function()
{
    console.log("Express 서버로 시작함");
});