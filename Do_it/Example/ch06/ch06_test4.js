// < 데이터베이스 : MongoDB 활용 >
/*
    * 인덱스와 메소드 활용하기
        -> 스키마 타입(type)에 대해
            String : 문자열 타입
            Number : 숫자 타입
            Boolean : 이진 타입
            Array : 배열 타입
            Buffer : 버퍼 타입(바이너리 데이터)
            Date : 날짜 타입
            ObjectId : 각 문서마다 만들어지는 ObjectId를 저장할 수 있는 타입
            Mixed : 혼합 타입
            
        -> 검색속도 향상을 위해 인덱스를 사용한다.
            required : 필수요소 지정
            qunique : 중복을 허용하지 않는 유일한 값
            index : ??
            default : 기본값
            
        -> 예시
        var UserSchema = new mongoose.Schema(
        {
            // unique: true 속성으로 인해 자동으로 인덱스 생성
            id: { type: String, required: true, unique: true },
            
            password: { type: String, required: true },
            
            // index: "hashed"도 인덱스 생성
            name: { type: String, index: "hashed" },
            
            age: Number,
            
            // index: {unique: false, expires: "1d"}로 인덱스 생성 및 유효기간까지 지정
            created_at: { type: Date, index: {unique: false, expires: "1d"} },
            
            updated_at: Date
        });
        
        -> 위치 기반 서비스를 사용하면 경위도 좌표에 의한 공간 인덱싱도 있음.
           { type: [Number], index: "2d", sparse: true }
           
        -> 스키마에 메소드를 추가할 수 있다.
            static(name, fn) : 모델 객체에서 사용할 수 있는 함수를 등록한다.
            method(name, fn) : 모델 인스턴스 객체에서 사용할 수 있는 함수를 등록한다.
            
    * 테스트
        -> http://127.0.0.1:3000/public/login.html
*/

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
                res.write("<br><br><a href=\"/public/listuser.html\">사용자 리스트 보기</a>");
                res.write("<br><a href=\"/public/login.html\">다시 로그인하기</a>");
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
            
            if (result)
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
router.route("/process/listuser").post(function(req, res)
{
    console.log("POST /process/listuser 호출됨");
    
    if (null == mongoDatabase)
    {
        res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
        res.write("<h2>데이터베이스 연결 실패</h2>");
        res.write("<div><p>데이터베이스에 연결하지 못했습니다.</p></div>");
        res.end();
    }
    else
    {
        UserModel.findAll(function(err, results)
        {
            if (err)
            {
                console.error("사용자 리스트 조회 중 오류 발생 : " + err.stack);
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write("<h1>사용자 리스트 조회 중 오류 발생</h1>");
                res.write("<p>" + err.stack + "</p>");
                res.end();
                return;
            }
            
            if (results)
            {
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write("<h2>사용자 리스트</h2>");
                
                res.write("<div><ul>");
                for (var i = 0; i < results.length; ++i)
                {
                    var curId = results[i]._doc.id;
                    var curName = results[i]._doc.name;
                    res.write("    <li>#" + i + " : " + curId + ", " + curName + "</li>");
                }
                res.write("</ul></div>");
                res.write("<br><br><a href=\"/public/login.html\">로그인하기</a>");
                res.write("<br><a href=\"/public/adduser.html\">가입하기</a>");
                res.end();
            }
            else
            {
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write("<h1>사용자 리스트 조회 실패</h1>");
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

// Mongoose로 DB 등록
var mongoDatabase;
var UserSchema;
var UserModel;
var connectDB = function()
{
    var databaseUrl = "mongodb://localhost:27017/login";
    
    console.log("데이터베이스 연결을 시도합니다.");
    mongoose.Promise = global.Promise;
    mongoose.connect(databaseUrl, { useNewUrlParser: true });
    mongoDatabase = mongoose.connection;
    
    mongoDatabase.on("error", console.error.bind(console, "mongoose connection error."));
    
    mongoDatabase.on("open", function()
    {
        console.log("데이터베이스에 연결되었습니다. : " + databaseUrl);
        
        // 스키마 정의 ( 인덱스, 기본값 정의 포함 )
        UserSchema = mongoose.Schema(
        {
            id: { type: String, required: true, unique: true },
            password: { type: String, required: true },
            name: { type: String, index: "hashed" },
            age: { type: Number, "default": -1},
            created_at: {type: Date, index: {unique:false}, "default": Date.now},
            updated_at: {type: Date, index: {unique:false}, "default": Date.now}
        });
        
        // 스키마 static 메소드 정의
        UserSchema.static("findById", function(id, callback)
        {
            return this.find({id : id}, callback);
        });
        UserSchema.static("findAll", function(callback)
        {
            return this.find({}, callback);
        });
        console.log("Scheme 정의함.");
        
        // 스키마로 모델 생성
        UserModel = mongoose.model("users2", UserSchema);
        console.log("UserModel 정의함.");
    });
    
    mongoDatabase.on("disconnected", function()
    {
        console.log("연결이 끊어졌습니다.  5초 후 다시 연결합니다.");
        setInterval(connectDB, 5000);
    });
};

// Mongoose를 이용해 사용자를 인증하는 함수
var authUser = function(database, id, password, callback)
{
    console.log("authUser 호출됨");
    
    UserModel.findById(id, function(err, results)
    {
        if (err)
        {
            callback(err, null);
            return;
        }
        
        if (0 < results.length)
        {   
            // 비밀번호 일치 확인
            if (password == results[0]._doc.password)
            {
                console.log("아이디 [%s], 비밀번호 [%s]가 일치하는 사용자 찾음.", id, password);
                callback(null, results);
                return;
            }
        }

        console.log("아이디 [%s], 비밀번호 [%s]가 일치하는 사용자 찾지 못함.", id, password);
        
        callback(null, null);
    });
};

// Mongoose를 이용하여 사용자를 추가하는 함수
var addUser = function(database, id, password, name, callback)
{
    console.log("addUser 호출됨 : " + id + ", " + password + ", " + name);
    
    var user = new UserModel({"id":id, "password":password, "name":name});
    user.save(function(err)
    {
        if (err)
        {
            callback(err, null);
            return;
        }
        
        console.log("사용자 레코드 추가됨");
        
        callback(null, user);
    });
};

// 서버시작
http.createServer(expressApp).listen(expressApp.get("port"), function()
{
    console.log("서버가 시작되었습니다. 포트 : " + expressApp.get("port"));
    
    connectDB();
});