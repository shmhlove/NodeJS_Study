// < 웹 서버 만들기 : Express 외부 미들웨어 활용하기 >
/*
    파일 업로드 멀티파트 모듈
        -> npm install multer --save
        -> npm install cors --save
        
    multipart 포멧은 음악이나 이미지 파일 등을 일반 데이터와 함께 웹 서버로 보내려고 만든 표준
    파일 업로드는 POST 방식으로 데이터를 전송한다.
    
    * 테스트 *
    http://127.0.0.1:3000/public/uploader.html
*/

var express = require("express");
var expressStatic = require("serve-static");
var expressBodyParser = require("body-parser");
var expressErrorHandler = require("express-error-handler");

var cookieParser = require("cookie-parser");
var expressSession = require("express-session");

var multer = require("multer");
var cors = require("cors");

var path = require("path");
var http = require("http");
var fs = require("fs");

var expressApp = express();
expressApp.set("port", process.env.PORT || 3000);
expressApp.use(expressBodyParser.urlencoded({ extended: false }));
expressApp.use(expressBodyParser.json());
expressApp.use("/public", expressStatic(path.join(__dirname, "public")));
expressApp.use("/uploads", expressStatic(path.join(__dirname, "uploads")));

expressApp.use(cookieParser());

expressApp.use(expressSession(
    {
        secret: "my key",
        resave: true,
        saveUninitialized: true
    }
));

// 클라이언트에서 ajax로 요청했을 때 CORS(다중 서버 접속) 지원
expressApp.use(cors());

// multer 미들웨어 사용 : 미들웨어 사용 순서 중요 body-parser -> multer -> router
// 파일제한 : 10개 1GB
var storage = multer.diskStorage(
    {
        destination: function(req, file, callback) 
        {
            callback(null, "./Example/ch05/uploads");
        },
        filename: function (req, file, callback)
        {
            callback(null, Date.now() + "_" + file.originalname);
        }
    }
);

var upload = multer(
    {
        storage: storage,
        limits: 
        {
            files: 10,
            fileSize: 1024 * 1024 * 1024 * 1024
        }
    }
);

var router = express.Router();
router.route("/process/upload").post(upload.array("photo"), function(req, res)
{
    console.log("/process/upload 호출됨");
    
    try
    {
        var files = req.files;
        
        var originalName = [];
        var fileName = [];
        var mimeType = [];
        var size = [];
        
        console.log("배열에 들어있는 파일 갯수 : %d", files.length);
        
        var count = 0;
        var addFileInfo = function(file)
        {
            originalName[count] = file.originalname;
            fileName[count] = file.filename;
            mimeType[count] = file.mimetype;
            size[count] = file.size;
            
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
        
        res.writeHead("200", {"Content-Type" : "text/html;charset=utf8"});
        res.write("<h3>파일 업로드 성공</h3>");
        res.write("<hr/>");
        for (var index=0; index<count; ++index)
        {
            res.write("<p>원본 파일 이름 : " + originalName[index] + " -> 저장 파일명 : " + fileName[index] + "</p>");
            res.write("<p>MIME TYPE : " + mimeType[index] + "</p>");
            res.write("<p>파일 크기 : " + size[index] + "</p>");
            res.write("<hr/>");
        }
        res.write("<br/>");
        res.write("<br/>");
        res.write("<a href=\"/public/uploader.html\">다른 파일 업로드</a>");
        res.end();
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