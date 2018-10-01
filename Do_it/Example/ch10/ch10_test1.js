// < 채팅 서버 만들기 : socket.io 사용하기 >
/*
    * 소켓 모듈 설치
        -> npm install socket.io --save
*/

var express = require("express");
var expressStatic = require("serve-static");
var expressBodyParser = require("body-parser");
var expressErrorHandler = require("express-error-handler");

var cookieParser = require("cookie-parser");
var expressSession = require("express-session");

var path = require("path");
var https = require("https");

// Passport를 활용한 인증
var passport = require("passport");
// 간단한 상태정보를 웹 문서에 보내주거나 쉽게 확인할 수 있음
// req.flash("key", "message"); or req.flash("key")
var flash = require("connect-flash");

var configModule = require("./Module_test3/config");
var databaseModule = require("./Module_test3/database");
var routerModule = require("./Module_test3/router_loader");

var expressApp = express();

// 뷰 엔진 등록
expressApp.set("views", __dirname + "/views");
expressApp.set("view engine", "ejs");
console.log("뷰 엔진이 ejs로 설정되었습니다.");

// 포트설정
expressApp.set("port", process.env.PORT || configModule.server_port);

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

// 익스프레스에 패스포트 등록
expressApp.use(passport.initialize());
expressApp.use(passport.session());
expressApp.use(flash());

// 라우터 등록
var router = express.Router();
routerModule.init(expressApp, router);

// 라우터 설정
var routerPassportModule = require("./Module_test3/router_passport");
routerPassportModule(expressApp, passport);

// 패스포트 설정
var passportModule = require("./Module_test3/passport");
passportModule(expressApp, passport);

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

//확인되지 않은 예외 처리 - 서버 프로세스 종료하지 않고 유지함
process.on('uncaughtException', function (err)
{
	console.log('uncaughtException 발생함 : ' + err);	
	console.log(err.stack);
    process.exit();
});

// 프로세스 종료 시에 데이터베이스 연결 해제
process.on('SIGTERM', function ()
{
    console.log("프로세스가 종료됩니다.");
    //expressApp.close();
    process.exit();
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
var fs = require("fs");
var options =
{
    key: fs.readFileSync("./Example/ch09/Certificate/key.pem"),
    cert: fs.readFileSync("./Example/ch09/Certificate/cert.pem")
};

var server = https.createServer(options, expressApp).listen(expressApp.get("port"), function()
{
    console.log("서버가 시작되었습니다. 포트 : " + expressApp.get("port"));
    
    databaseModule.init(expressApp, configModule);
});