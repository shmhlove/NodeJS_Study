// < 6장 도전과제 2 >
// 5장에서 만든 업로드과제에서 데이터베이스 기능을 추가합니다.
// sudo mongod --dbpath /data/db
// http://127.0.0.1:3000/public/memo_picture.html

var express = require("express");
var expressStatic = require("serve-static");
var expressBodyParser = require("body-parser");
var expressErrorHandler = require("express-error-handler");

var cookieParser = require("cookie-parser");
var expressSession = require("express-session");
var mongoClient = require("mongodb").MongoClient;
var mongoose = require("mongoose");

var multer = require("multer");
var cors = require("cors");

var path = require("path");
var http = require("http");
var fs = require("fs");

var expressApp = express();

// 포트설정
expressApp.set("port", process.env.PORT || 3000);

// body파서 등록(POST방식에서 body를 쉽게 읽을 수 있도록)
expressApp.use(expressBodyParser.urlencoded({ extended: false }));
expressApp.use(expressBodyParser.json());

// static 패스 등록(public와 uploads 디렉토리를 /public, /uploads으로 접근할 수 있도록)
expressApp.use("/public", expressStatic(path.join(__dirname, "public")));
expressApp.use("/uploads", expressStatic(path.join(__dirname, "uploads")));

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

// 클라이언트에서 ajax로 요청했을 때 CORS(다중 서버 접속) 지원
// 지금은 없어도 되는데??
// ajax이 뭔지 다중 서버 접속??이 뭔지 정확한 개념을 모르겠다.
expressApp.use(cors());

// multer 미들웨어 사용 : 미들웨어 사용 순서 중요 body-parser -> multer -> router
var upload = multer(
    {
        // 저장소 설정
        storage: multer.diskStorage(
        {
            // 업로드 된 파일이 저장될 목적지
            destination: function(req, file, callback) 
            {
                callback(null, "./Example/ch06/uploads");
            },
            // 저장될 파일 이름
            filename: function (req, file, callback)
            {
                callback(null, Date.now() + "_" + file.originalname);
            }
        }),
        
        // 제한 설정 : 한번에 업로드 가능한 파일 수(10개)와, 용량(1GB)
        limits: 
        {
            files: 10,
            fileSize: 1024 * 1024 * 1024 * 1024
        }
    }
);

var router = express.Router();
router.route("/process/memo").post(upload.array("photo"), function(req, res)
{
    console.log("/process/upload 호출됨");
    
    console.log("작성자 : " + req.body.user + ", " + "작성일 : " + req.body.date + ", " + "메모 : " + req.body.memo);
    
    try
    {
        var files = req.files;
        
        var originalName = [];
        var fileName = [];
        var mimeType = [];
        var size = [];
        var path = [];
        
        console.log("배열에 들어있는 파일 갯수 : %d", files.length);
        
        var count = 0;
        var addFileInfo = function(file)
        {
            originalName[count] = file.originalname;
            fileName[count] = file.filename;
            mimeType[count] = file.mimetype;
            size[count] = file.size;
            path[count] = file.path;
            
            console.log("업로드 된 파일 정보 : " + originalName[count] + ", " + fileName[count] + ", " + mimeType[count] + ", " + size[count]);
            
            count = count + 1;
        };
        
        if (Array.isArray(files))
        {
            for (var index=0; index < files.length; ++index)
            {
                addFileInfo(files[index]);
            }
        }
        else
        {
            addFileInfo(files);
        }
        
        res.writeHead("200", {"Content-Type" : "text/html;image/jpeg;charset=utf8"});
        res.write("<h3>나의 메모</h3>");
        res.write("<hr/>");
        for (var index=0; index<count; ++index)
        {
            res.write("<p>원본 파일 이름 : " + originalName[index] + " -> 저장 파일명 : " + fileName[index] + "</p>");
            res.write("<p>MIME TYPE : " + mimeType[index] + "</p>");
            res.write("<p>파일 크기 : " + size[index] + "</p>");
            
            // 미리보기 개발
            var imgPath = "http://127.0.0.1:3000/uploads/" + fileName[index];
            res.write("<img src=" + imgPath + " width=100 height=100");
            res.write("<br/>");
            res.write("<p>" + imgPath + "</p>");
            res.write("<hr/>");
        }
        
        WriteMemo(req.body.user, req.body.date, req.body.memo, path[0], function(err, memo)
        {
            if (err)
            {
                res.write("<p>데이터베이스 저장 실패</p>");
            }
            else
            {
                res.write("<p>데이터베이스 저장 성공</p>");
            }
            res.write("<hr/>");
            res.write("<br/>");
            res.write("<br/>");
            res.write("<a href=\"/public/memo_picture.html\">다시 작성</a>");
            
            res.end();
        });
    }
    catch(err)
    {
        console.dir(err.stack);
    }
})
expressApp.use("/", router);

// Express 객체에 에러 핸들러 등록
var errorHandler = expressErrorHandler(
    {
        static: 
        {
            "404": "./Example/ch06/public/404.html"
        }
    }
);
expressApp.use(expressErrorHandler.httpError(404));
expressApp.use(errorHandler);

// Mongoose로 DB 등록
var mongoDatabase;
var memoSchema;
var memoModel;
var connectDB = function()
{
    var databaseUrl = "mongodb://localhost:27017/ch06_task2";
    
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
            imgPath: { type: String, "default": "" }
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

var WriteMemo = function(name, date, memo, imgPath, callback)
{
    console.log("WriteMemo 호출됨 : " + name + ", " + date + ", " + memo);
    
    var memo = new memoModel({"name": name, "date": date, "memo": memo, "imgPath": imgPath});
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