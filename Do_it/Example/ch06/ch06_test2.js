// < 데이터베이스 : MongoDB 활용 >
/*
    조회 : Database.db("%DB Name%").collection("%Collection Name%").find();
    추가 : Database.db("%DB Name%").collection("%Collection Name%").insertMany();
    
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
var mongoClient = require("mongodb").MongoClient;

var path = require("path");
var http = require("http");

var expressApp = express();

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

// 라우터 등록
var router = express.Router();
router.route("/process/login").post(function(req, res)
{
    console.log("POST /process/login 호출됨");
    
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    
    if (null == mongoDatabase)
    {
        res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
        res.write("<h2>데이터베이스 연결 실패</h2>");
        res.write("<div><p>데이터베이스에 연결하지 못했습니다.</p></div>");
        res.end();
    }
    else
    {
        authUser(mongoDatabase, paramId, paramPassword, function(err, docs)
        {
            if (err)
            {
                throw err;
            }
            
            if (docs)
            {
                var userName = docs[0].name;
                
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write("<h1>로그인 성공</h1>");
                res.write("<div><p>사용자 아이디 : " + paramId + "</p></div>");
                res.write("<div><p>사용자 이름 : " + userName + "</p></div>");
                res.write("<br><br><a href=\"/public/login.html\">다시 로그인하기</a>");
                res.end();
            }
            else
            {
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write("<h1>로그인 실패</h1>");
                res.write("<div><p>아이디와 비밀번호를 다시 확인하십시오</p></div>");
                res.write("<br><br><a href=\"/public/login.html\">다시 로그인하기</a>");
                res.end();
            }
        });        
    }
});

router.route("/process/adduser").post(function(req, res)
{
    console.log("POST /process/adduser 호출됨");
    
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    var paramName = req.body.name || req.query.name;
    
    if (null == mongoDatabase)
    {
        res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
        res.write("<h2>데이터베이스 연결 실패</h2>");
        res.write("<div><p>데이터베이스에 연결하지 못했습니다.</p></div>");
        res.end();
    }
    else
    {
        addUser(mongoDatabase, paramId, paramPassword, paramName, function(err,  result)
        {
            if (err)
            {
                throw err;
            }
            
            if (result && 0 < result.insertedCount)
            {
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write("<h1>사용자 추가 성공</h1>");
                res.write("<div><p>사용자 아이디 : " + paramId + "</p></div>");
                res.write("<div><p>사용자 이름 : " + paramName + "</p></div>");
                res.write("<br><br><a href=\"/public/login.html\">로그인하기</a>");
                res.end();
            }
            else
            {
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write("<h1>사용자 추가 실패</h1>");
                res.end();
            }
        });
    }
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

// Mongo DB 등록
var mongoDatabase;
var connectDB = function()
{
    var databaseUrl = "mongodb://localhost:27017/login";
    mongoClient.connect(databaseUrl, { useNewUrlParser: true }, function(err, db)
    {
        if (err)
        {
            throw err;
        }
        
        console.log("데이터베이스에 연결되었습니다. : " + databaseUrl);
        mongoDatabase = db;
    });
};

// MongoDB를 이용해 사용자를 인증하는 함수
var authUser = function(database, id, password, callback)
{
    console.log("authUser 호출됨");
    
    var users = database.db("login").collection("users");
    users.find({"id" : id, "password" : password}).toArray(function(err, docs)
    {
        if (err)
        {
            callback(err, null);
            return;
        }
        
        if (0 < docs.length)
        {
            console.log("아이디 [%s], 비밀번호 [%s]가 일치하는 사용자 찾음.", id, password);
            callback(null, docs);
        }
        else
        {
            console.log("아이디 [%s], 비밀번호 [%s]가 일치하는 사용자 찾지 못함.", id, password);
            callback(null, null);
        }
    });
};

// 사용자를 추가하는 함수
var addUser = function(database, id, password, name, callback)
{
    console.log("addUser 호출됨 : " + id + ", " + password + ", " + name);
    
    var users = database.db("login").collection("users");
    users.insertMany([{"id":id, "password":password, "name":name}], function(err, result)
    {
        if (err)
        {
            callback(err, null);
            return;
        }
        
        if (0 < result.insertedCount)
        {
            console.log("사용자 레코드 추가됨 : " + result.insertedCount);
        }
        else
        {
            console.log("추가된 레코드가 없음");
        }
        
        callback(null, result);
    });
};

// 서버시작
http.createServer(expressApp).listen(expressApp.get("port"), function()
{
    console.log("서버가 시작되었습니다. 포트 : " + expressApp.get("port"));
    
    connectDB();
});