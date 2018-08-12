// < 웹 서버 만들기 : Express 외부 미들웨어 활용하기 >
/*
    쿠키와 세션 관리하기
    -> npm install cookie-parser --save
    -> npm install express-session --save
    
    * 테스트 *
    쿠키 테스트 : http://127.0.0.1:3000/process/setUserCookie
    세션 테스트 : http://127.0.0.1:3000/process/product
    
    * 브라우저에서 확인 *
    설정 -> 도구 더보기 -> 개발자 도구 -> 하단 Application 탭 -> Cookies
*/

var express = require("express");
var expressStatic = require("serve-static");
var expressBodyParser = require("body-parser");
var expressErrorHandler = require("express-error-handler");

var cookieParser = require("cookie-parser");
var expressSession = require("express-session");

var path = require("path");
var http = require("http");

var expressApp = express();

expressApp.use(expressBodyParser.urlencoded({extended: false}));
expressApp.use(expressBodyParser.json());
expressApp.use("/", expressStatic(path.join(__dirname, "public")));
expressApp.use(cookieParser());
expressApp.use(expressSession(
    {
        secret: "my key",
        resave: true,
        saveUninitialized: true
    }
));

// 라우터에 패스에 따라 실행될 함수등록
var router = express.Router();

// 쿠키처리 연습
router.route("/process/showCookie").get(function(req, res)
{
    console.log("GET 요청 : ShowCookie");
    console.dir(req.cookies);
    res.send(req.cookies);
});

router.route("/process/setUserCookie").get(function(req, res)
{
    console.log("GET 요청 : setUserCookie");
    
    res.cookie("user", 
    {
        id: "SangHo",
        name: "트와이스",
        authorized: true
    });
    
    res.redirect("/process/showCookie");
});

// 세션 처리 연습
router.route("/process/product").get(function(req, res)
{
    console.log("GET 요청 : product");
    
    if (req.session.user)
    {
        console.dir(req.session.user);
        res.redirect("/product.html");
    }
    else
    {
        res.redirect("/login_router.html");
    }
});

router.route("/process/logout").get(function(req, res)
{
    console.log("GET 방식 요청 : logout");
    
    if (req.session.user)
    {
        console.log("로그아웃합니다.");
        
        req.session.destroy(function(err)
        {
            if (err)
            {
                throw err;
            }
            
            console.log("세션을 삭제하고 로그아웃되었습니다.");
            res.redirect("/login_router.html");
        });
    }
    else
    {
        console.log("아직 로그인되어 있지 않습니다.");
        res.redirect("/login_router.html");
    }
});

router.route("/process/login").post(function(req, res)
{
    console.log("POST 방식 요청");
        
    if (req.session.user)
    {
        console.log("이미 로그인되어 상품 페이지로 이동합니다.");
        res.redirect("/product.html");
    }
    else
    {
        var paramId = req.body.id;
        var paramPassword = req.body.password;
        
        req.session.user = 
        {
            id: paramId,
            name: "소녀시대",
            authorized: true
        };
        
        res.writeHead("200", {"Content-Type":"text/html;charset=utf8"});
        res.write("<h1>로그인 성공</h1>");
        res.write("<div><p>Param id : " + paramId + "</p></div>");
        res.write("<div><p>Param password : " + paramPassword + "</p></div>");
        res.write("<br><br><a href=\"/process/product\">상품 페이지로 이동하기</a>");
        res.end();
    }
});

// Express 객체에 라우터 등록
expressApp.use("/", router);
expressApp.set("port", process.env.PORT ? process.env.PORT : 3000);

http.createServer(expressApp).listen(expressApp.get("port"), function()
{
    console.log("Express 서버로 시작함");
});