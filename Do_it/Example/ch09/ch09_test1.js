// < 패스포트(passport)를 활용한 인증 : 로컬인증 >
/*
    * 패스포트 설치
        -> npm install passport --save
        -> npm install passport-local --save
        
    * 플래시 메시지
        -> 리다이펙트를 사용해서 응답을 보낼때 사용하는 메시지 뭉치
        -> npm install connect-flash --save
        -> setting -> req.flash("loginMessage", "등록된 계정이 없습니다.");
        -> getting -> req.flash("loginMessage");
        
    * 뷰 템플릿
        -> 부트스트랩을 사용할 것임 (모던한 스타일의 UI를 쉽게 만들 수 있음)
        -> http://getbootstrap.com/
        -> index.ejs, login.ejs, signup.ejs, profile.ejs
        
    * 테스트
        -> sudo mongod --dbpath /data/shopping
        -> http://127.0.0.1:3000/
*/

var express = require("express");
var expressStatic = require("serve-static");
var expressBodyParser = require("body-parser");
var expressErrorHandler = require("express-error-handler");

var cookieParser = require("cookie-parser");
var expressSession = require("express-session");

var path = require("path");
var http = require("http");

// Passport를 활용한 인증
var passport = require("passport");
// 로컬 스트래티지 : 데이터베이스에서 사용자 정보를 찾아 검증
var passportLocalStrategy = require('passport-local').Strategy;
// 간단한 상태정보를 웹 문서에 보내주거나 쉽게 확인할 수 있음
// req.flash("key", "message"); or req.flash("key")
var flash = require("connect-flash");

var routerModule = require("./Module_test1/router_loader");
var configModule = require("./Module_test1/config");
var databaseModule = require("./Module_test1/database");

var expressApp = express();

// 뷰 엔진 등록
expressApp.set("views", __dirname + "/views");
expressApp.set("view engine", "ejs");
console.log("뷰 엔진이 ejs로 설정되었습니다.");

// 포트설정
expressApp.set("port", configModule.server_port);

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

router.route("/").get(function(req,res)
{
    console.log("/ 패스 요청됨.");
    res.render("index.ejs");
});

// 로그인 화면 - login.ejs 템플릿을 이용해 로그인 화면이 보이도록 함
router.route("/login").get(function(req, res)
{
    console.log("/login 패스 요청됨");
    res.render('login.ejs', {message: req.flash('loginMessage')});
});

// 사용자 인증 - POST로 요청받으면 패스포트에 설정된 스트래티지를 이용해 인증함
// 성공 시 /profile로 리다이렉트, 실패 시 /login으로 리다이렉트함
// 인증 실패 시 검증 콜백에서 설정한 플래시 메시지가 응답 페이지에 전달되도록 함
// 음....> 스트래티지에서 전달받는 email, password는 어디서 주는거지??
//   ....> 웹 브라우저에서 요청 파라미터의 이름을 email, password로 설정해야한다.
router.post("/login", passport.authenticate("local-login", 
{
    successRedirect : "/profile",
    failureRedirect : "/login",
    failureFlash : true
}));

// 회원가입 화면 - signup.ejs 템플릿을 이용해 회원가입 화면이 보이도록 함
router.route('/signup').get(function(req, res) 
{
	console.log('signup 패스 요청됨.');
	res.render("signup.ejs", {message : req.flash("signupMessage")});
});

// 회원가입 - POST로 요청받으면 패스포트를 이용해 회원가입 유도함
// 인증 확인 후, 성공 시 /profile 리다이렉트, 실패 시 /signup으로 리다이렉트함
// 인증 실패 시 검증 콜백에서 설정한 플래시 메시지가 응답 페이지에 전달되도록 함
router.route('/signup').post(passport.authenticate('local-signup', 
{
    successRedirect : '/profile', 
    failureRedirect : '/signup', 
    failureFlash : true 
}));

// 프로필 화면 - 로그인 여부를 확인할 수 있도록 먼저 isLoggedIn 미들웨어 실행
router.route('/profile').get(function(req, res)
{
	console.log('/profile 패스 요청됨.');
    
    // 인증된 경우, req.user 객체에 사용자 정보 있으며, 인증안된 경우 req.user는 false값임
    console.log('req.user 객체의 값');
	console.dir(req.user);
    
    // 인증 안된 경우
    if (!req.user)
    {
        console.log('사용자 인증 안된 상태임.');
        res.redirect('/');
        return;
    }
	
    // 인증된 경우
    console.log('사용자 인증된 상태임.');
	if (Array.isArray(req.user))
    {
		res.render('profile.ejs', {user: req.user[0]._doc});
	} else
    {
		res.render('profile.ejs', {user: req.user});
	}
});

// 로그아웃 - 로그아웃 요청 시 req.logout() 호출함
router.route('/logout').get(function(req, res)
{
	console.log('/logout 패스 요청됨.');
    
	req.logout();
	res.redirect('/');
});

// Local Strategy로 패스포트 로그인 설정
// 1. 음....> 스트래티지에서 전달받는 email, password는 어디서 주는거지??
//     ....> 웹 브라우저에서 요청 파라미터의 이름을 email, password로 설정해야한다.
/* html에서 이런식으로 이름을 사용해서 보내줘야 됨.
    <form action="login" method="post"> -> 라우터에 설정
    <input type="text" name="email">
    <input type="password" name="password">
*/

// 2. 음....> done은 어디서 전달받게 되는거지??
//     ....> authenticate()를 호출하는 쪽에서 받는다고함.. authenticate는 누가호출해주는거지?
//     ....> 라우터 등록할때 호출하고 있는데 거기서는 done을 전달받지 않음.
//     ....> 아... 커스텀 콜백을 사용하면 받는구나... 그러면 이코드에서는 사용 안되는 콜백이겠네??

passport.use("local-login", new passportLocalStrategy(
{
    usernameField : "email",
    passwordField : "password",
    passReqToCallback : true
}, function(req, email, password, done)
{
    console.log("passport의 local-login 호출됨 : " + email + ", " + password);
    
    var database = expressApp.get("database");
    database.UserModel.findOne({"email" : email}, function(err, user)
    {
        if (err)
        {
            return done(err);
        }
        
        if (!user)
        {
            console.log("계정이 일치하지 않음.");
            return done(null, false, req.flash("loginMessage", "등록된 계정이 없습니다."));
        }
        
        var authenticated = user.authenticate(password, user._doc.salt, user._doc.hashed_password);
        
        if (!authenticated)
        {
            console.log("비밀번호 일치하지 않음.");
            return done(null, false, req.flash("loginMessage", "비밀번호가 일치하지 않습니다."));
        }
        
        console.log("계정과 비밀번호가 일치함.");
        return done(null, user);
    });
}));

// Local Strategy로 패스포트 회원가입 설정
passport.use("local-signup", new passportLocalStrategy(
{
    usernameField : "email",
    passwordField : "password",
    passReqToCallback : true
}, function(req, email, password, done)
{
    var paramName = req.body.name || req.query.name;
    console.log("passport의 local-signup 호출됨 : " + email + ", " + password + ", " + paramName);
    
    // User.findOne이 blocking 되므로 async 방식으로 변경할 수도 있음
    process.nextTick(function()
    {
        var database = expressApp.get("database");
        database.UserModel.findOne({"email" : email}, function(err, user)
        {
            if (err)
            {
                return done(err);
            }
            
            if (user)
            {
                console.log("기존에 계정이 있음.");
                return done(null, false, req.flash("signupMessage", "계정이 이미 있습니다."));
            }
            else
            {
                var user = new database.UserModel({"email" : email, "password" : password, "name": paramName});
                user.save(function(err)
                {
                    if (err)
                    {
                        throw err;
                    }

                    console.log("사용자 데이터 추가함.");
                    return done(null, user);
                });
            }
        });
    });
}));

// 사용자 인증이 성공했을때 호출 됨.
passport.serializeUser(function(user, done)
{
    console.log("serializeUser() 호출됨.");
    console.dir(user);
    done(null, user);
});

// 사용자 인증 후 요청이 들어올 때마다 호출 됨.
passport.deserializeUser(function(user, done)
{
    console.log("deserializeUser() 호출됨.");
    console.dir(user);
    done(null, user);
});

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
    expressApp.close();
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
var server = http.createServer(expressApp).listen(expressApp.get("port"), function()
{
    console.log("서버가 시작되었습니다. 포트 : " + expressApp.get("port"));
    
    databaseModule.init(expressApp, configModule);
});