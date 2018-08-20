// < 데이터베이스 : MongoDB 활용 >
/*
    * 몽구스의 virtual 메소드 활용하기
        -> MongoDB 컬렉션에 저장되지 않는 가상의 속성을 추가함
        -> 활용법은 
            - 실제 DB에 저장되는 필드명을 다르게 하고 싶을때나
            - 여러 필드를 한번에 받고, virtual메소드에서 스플릿해서 속성값을 처리할때
        
    * 비밀번호를 암호화 해서 저장
        -> npm install crypto --save
        -> 내장 모듈로 변경됨
        
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
var mongoose = require("mongoose");
var crypto = require("crypto");

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
    
    mongoDatabase.on("error", console.error.bind(console, "Mongoose connection error."));
    
    mongoDatabase.on("open", function()
    {
        console.log("데이터 베이스에 연결되었습니다." + databaseUrl);
        createUserSchema();
        doTest();
        //mongoDatabase.close();
    });
    
    mongoDatabase.on("disconnected", function()
    {
        console.log("연결이 끊어졌습니다.");
        // setInterval(connectDB, 5000);
    });
};

// 스키마 정의 함수
var createUserSchema = function()
{
    // 스키마 정의
    UserSchema = mongoose.Schema(
    {
        id: {type:String, required:true, unique:true},
        
        // 암호화된 암호를 저장
        hashed_password: {type:String, required:true, "default":""},
        
        // 암호화에 필요한 Key값 저장
        salt: {type:String, required:true},
        
        name: {type:String, index:"hashed", "default":""},
        
        age: {type:Number, "default":-1},
        
        created_at: {type:Date, index:{unique:false, "default":Date.now}},
        
        updated_at: {type:Date, index:{unique:false, "default":Date.now}},
    });
    
    // 스키마 static 메소드 추가
    UserSchema.static("findById", function(id, callback)
    {
        return this.find({id : id}, callback);
    });
    UserSchema.static("findAll", function(callback)
    {
        return this.find({}, callback);
    });
    
    // 스키마 virtual 메소드 추가
    UserSchema.virtual("password").set(function(password)
    {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
        console.log("virtual password 호출됨 : " + this.hashed_password);
    })
    .get(function() { return this._password });
    
    UserSchema.virtual("info").set(function(info)
    {
        var splitted = info.split(" ");
        this.id = splitted[0];
        this.name = splitted[1];
        console.log("virtual info 설정함 : %s, %s", this.id, this.name);
    })
    .get(function()
    {
        console.log("컬렉션 get 호출됨");
        return this.id + " " + this.name;
    });
    
    // 스키마 모델 인스턴스 메소드 추가
    UserSchema.method("makeSalt", function()
    {
        return Math.round((new Date().valueOf() * Math.random())) + "";
    });
    UserSchema.method("encryptPassword", function(plainText, inSalt)
    {
        if (inSalt)
        {
            var hmac = crypto.createHmac("sha1", inSalt);
            return hmac.update(plainText).digest("hex");
            //return crypto.createHmac("sha1", inSalt).update(plainText).digest("hex");
        }
        else
        {
            var hmac = crypto.createHmac("sha1", this.salt);
            return hmac.update(plainText).digest("hex");
            //return crypto.createHmac("sha1", this.salt).update(plainText).digets("hex");
        }
    });
    UserSchema.method("authenticate", function(plainText, inSalt, hashed_password)
    {
        console.log("authenticate 호출됨 : %s -> %s : %s", plainText, this.encryptPassword(plainText, inSalt), hashed_password)
        
        return this.encryptPassword(plainText, inSalt) == hashed_password;
    });
    
    // 스키마 path 메소드로 속성의 유효성 검사
    UserSchema.path("id").validate(function(id)
    {
        return id.length;
    });
    UserSchema.path("name").validate(function(name)
    {
        return name.length;
    });
    console.log("UserSchema 정의함");
    
    // 스키마로 모델 생성
    var users = mongoDatabase.collection("users4");
    if (users)
    {
        users.drop();
        console.log("기존 컬렉션 제거함");
    }
    
    UserModel = mongoose.model("users4", UserSchema);
    console.log("UserModel 정의함."); 
};

// 사용자를 등록하는 함수
var addUser = function(database, id, password, name, callback)
{
    console.log("addUser 호출됨");
    
    var user = new UserModel({"id": id, "password": password, "name": name});
    
    user.save(function(err)
    {
        if (err)
        {
            callback(err, null);
            return;
        }
        
        console.log("사용자 데이터 추가함.");
        callback(null, user);
    });
};

// 사용자를 인증하는 함수 : 아이디로 먼저 찾고, 비밀번호를 비교
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
            console.log("아이디와 일치하는 사용자 찾음");
            
            var user = new UserModel({id: id});
            var authenticated = user.authenticate(password, results[0]._doc.salt, results[0]._doc.hashed_password);
            
            if (authenticated)
            {
                console.log("비밀번호 일치함");
                callback(null, results);
                return;
            }
        }
        
        console.log("아이디 [%s], 비밀번호 [%s]가 일치하는 사용자 찾지 못함.", id, password);
        
        callback(null, null);
    });
};

// MongoDB 조회함수
var findAll = function()
{
    console.log("findAll 호출됨");
    
    UserModel.findAll(function(err, results)
    {
        if (err)
        {
            throw err;
        }
        
        if (results)
        {
            console.log("조회된 user 문서 객체 #0 -> id : %s, name : %s", results[0]._doc.id, results[0]._doc.name);
        }
    });
};

// 테스트 실행 함수
var doTest = function()
{
    console.log("doTest 호출됨");
    
    // UserModel인스턴스를 생성하여 계정을 추가하는데
    // id와 name을 명시적으로 지정해주지 않고,
    // 오직 info 필드를 넣으면 virtual 메소드(info)가 호출되어
    // virtual 메소드의 구현대로 id와 name에 값을 넣어주게 된다.
    
    //var user = new UserModel({"info" : "test01 소녀시대 12345"});
    var user = new UserModel({"id": "test01", "password": "12345", "name": "소녀시대"});
    
    user.save(function(err)
    {
        if (err)
        {
            throw err;
        }
        
        console.log("사용자 데이터 추가함.");
        findAll();
    });
};

// 서버시작
http.createServer(expressApp).listen(expressApp.get("port"), function()
{
    console.log("서버가 시작되었습니다. 포트 : " + expressApp.get("port"));
    
    connectDB();
});