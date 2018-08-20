// < 6장 도전과제 1 >
// 5장에서 만든 메모과제에서 데이터베이스 기능을 추가합니다.
// sudo mongod --dbpath /data/db
// http://127.0.0.1:3000/public/memo.html

var express = require("express");
var expressStatic = require("serve-static");
var expressBodyParser = require("body-parser");
var expressErrorHandler = require("express-error-handler");

var cookieParser = require("cookie-parser");
var expressSession = require("express-session");
var mongoClient = require("mongodb").MongoClient;
var mongoose = require("mongoose");

var path = require("path");
var http = require("http");

var expressApp = express();

// 포트설정
expressApp.set("port", process.env.PORT || 3000);

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

// 라우터에 패스에 따라 실행될 함수등록
var router = express.Router();
router.route("/process/memo").post(function(req, res)
{
    console.log("POST 방식 요청");
    
    console.log("작성자 : " + req.body.user + ", " + "작성일 : " + req.body.date + ", " + "메모 : " + req.body.memo);
    
    WriteMemo(req.body.user, req.body.date, req.body.memo, function(err, memo)
    {
        
        res.writeHead(200, {"Content-Type": "text/html;charset=utf8"});
        res.write("<p>나의 메모</p>");
        res.write("<hr/>");
        res.write("<p>메모가 저장되었습니다.</p>");
        res.write("<p>작성자 : " + memo.name + "</p>");
        res.write("<p>작성일 : " + memo.date + "</p>");
        res.write("<p>메모 : " + memo.memo + "</p>");
        res.write("<a href=\"/public/memo.html\">다시 작성</a>");
        res.end();    
    });
});
expressApp.use("/", router);

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

// Mongoose로 DB 등록
var mongoDatabase;
var memoSchema;
var memoModel;
var connectDB = function()
{
    var databaseUrl = "mongodb://localhost:27017/ch06_task1";
    
    console.log("데이터베이스 연결을 시도합니다.");
    mongoose.Promise = global.Promise;
    mongoose.connect(databaseUrl, { useNewUrlParser: true });
    mongoDatabase = mongoose.connection;
    
    mongoDatabase.on("error", console.error.bind(console, "mongoose connection error."));
    
    mongoDatabase.on("open", function()
    {
        console.log("데이터베이스에 연결되었습니다. : " + databaseUrl);
        
        // 스키마 정의
        memoSchema = mongoose.Schema(
        {
            name: { type: String, require: true },
            date: { type: Date, "default": Date.now },
            memo: { type: String, "default": "" },
        });
        console.log("Scheme 정의함.");
        
        // 스키마로 모델 생성
        memoModel = mongoose.model("memo", memoSchema);
        console.log("memoModel 정의함.");
    });
    
    mongoDatabase.on("disconnected", function()
    {
        console.log("연결이 끊어졌습니다.  5초 후 다시 연결합니다.");
        setInterval(connectDB, 5000);
    });
};

var WriteMemo = function(name, date, memo, callback)
{
    console.log("WriteMemo 호출됨 : " + name + ", " + date + ", " + memo);
    
    var memo = new memoModel({"name": name, "date": date, "memo": memo});
    memo.save(function(err)
    {
        if (err)
        {
            callback(err, null);
            return;
        }
        
        console.log("메모 저장 됨");
        
        callback(null, memo);
    });
};

http.createServer(expressApp).listen(expressApp.get("port"), function()
{
    console.log("Express 서버로 시작함");
    
    connectDB();
});