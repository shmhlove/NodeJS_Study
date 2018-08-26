// < 뷰 템플릿 : ejs 활용 >
/*
    * ejs
        익스프레스에서 사용가능한 뷰 템플릿 중 ejs
        -> npm install ejs --save
        
    * 테스트
        -> sudo mongod --dbpath /data/db
        -> http://127.0.0.1:3000/public/login.html
*/

var express = require("express");
var expressStatic = require("serve-static");
var expressBodyParser = require("body-parser");
var expressErrorHandler = require("express-error-handler");

var cookieParser = require("cookie-parser");
var expressSession = require("express-session");

var path = require("path");
var http = require("http");

var routerModule = require("./Module/router_loader");
var configModule = require("./Module/config");
var databaseModule = require("./Module/database");

var expressApp = express();

// 포트설정
expressApp.set("port", process.env.PORT || configModule.server_port);

// 뷰 엔진 설정
expressApp.set("views", __dirname + "/ejs_views");
expressApp.set("view engine", "ejs");
console.log("뷰 엔진이 ejs로 설정되었습니다.");

// body파서 등록(POST방식에서 body를 쉽게 읽을 수 있도록)
expressApp.use(expressBodyParser.urlencoded({extended: false}));
expressApp.use(expressBodyParser.json());

// static 패스 등록(public디렉토리를 /public으로 접근할 수 있도록)
expressApp.use("/public", expressStatic(path.join(__dirname, "public")));

// 쿠키등록
expressApp.use(cookieParser());

// 세션등록
expressApp.use(expressSession(
    {
        secret: "my key",
        resave: true,
        saveUninitialized: true
    }
));

// 라우터 등록
routerModule.init(expressApp, express.Router());

// 에러 핸들러 등록
var errorHandler = expressErrorHandler(
{
    static:
    {
        "404": "./Example/ch06/public/404.html"
    }
});
expressApp.use(expressErrorHandler.httpError(404));
expressApp.use(errorHandler);

// 프로세스 종료 시에 데이터베이스 연결 해제
process.on('SIGTERM', function ()
{
    console.log("프로세스가 종료됩니다.");
    app.close();
});

expressApp.on('close', function()
{
	console.log("Express 서버 객체가 종료됩니다.");
	if (databaseModule.db)
    {
		databaseModule.db.close();
	}
});

// 서버시작
http.createServer(expressApp).listen(expressApp.get("port"), function()
{
    console.log("서버가 시작되었습니다. 포트 : " + expressApp.get("port"));
    
    databaseModule.init(expressApp, configModule);
});