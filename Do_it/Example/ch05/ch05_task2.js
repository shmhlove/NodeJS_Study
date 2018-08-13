// < 5장 도전과제 2 >
// 메모를 기록하고, 사진과 함께 웹 서버로 보내는 기능을 만들어 보세요.
// http://127.0.0.1:3000/public/memo_picture.html

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
                            callback(null, "./Example/ch05/uploads");
                        },
                        // 저장될 파일 이름
                        filename: function (req, file, callback)
                        {
                            callback(null, Date.now() + "_" + file.originalname);
                        }
                    }
                ),
        
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
        res.write("<br/>");
        res.write("<br/>");
        res.write("<a href=\"/public/memo_picture.html\">다시 작성</a>");
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