// < 채팅 서버 만들기 : 그룹 통신( 방 만들기 ) >
/*
    * 테스트
        -> sudo mongod --dbpath /data/shopping
        -> http://127.0.0.1:3000/public/chat04.html
*/

var express = require("express");
var expressStatic = require("serve-static");
var expressBodyParser = require("body-parser");
var expressErrorHandler = require("express-error-handler");

var cookieParser = require("cookie-parser");
var expressSession = require("express-session");

var path = require("path");
var http = require("http");
var https = require("https");

// Passport를 활용한 인증
var passport = require("passport");
// 간단한 상태정보를 웹 문서에 보내주거나 쉽게 확인할 수 있음
// req.flash("key", "message"); or req.flash("key")
var flash = require("connect-flash");

// socket.io 불러들이기
var socketio = require("socket.io");
var cors = require("cors");

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

// 웹 소켓 설정 : cors를 미들웨어로 사용하도록 등록
expressApp.use(cors());

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

var server = http.createServer(expressApp).listen(expressApp.get("port"), function()
//var server = https.createServer(options, expressApp).listen(expressApp.get("port"), function()
{
    console.log("서버가 시작되었습니다. 포트 : " + expressApp.get("port"));
    
    databaseModule.init(expressApp, configModule);
});

var io = socketio.listen(server);
console.log("socket.io 요청을 받아들일 준비가 되었습니다.");

// 소켓 이벤트 등록
var login_ids = {};
io.sockets.on("connection", function(socket)
{
    console.log("connection info : ", socket.request.connection._peername);
    socket.remoteAddress = socket.request.connection._peername.address;
    socket.remotePort = socket.request.connection._peername.port;
    
    socket.on("message", function(message)
    {
        console.log("message 이벤트를 받았습니다.");
        console.dir(message);

        if (message.recepient == "ALL")
        {
            console.dir("나를 포함한 모든 클라이언트에게 message 이벤트를 전송합니다.");
            io.sockets.emit('message', message);
        }
        else
        {
            if (login_ids[message.recepient])
            {
                io.sockets.connected[login_ids[message.recepient]].emit('message', message);
                
                // 응답 메시지 전송
                sendResponse(socket, 'message', '200', '메시지를 전송했습니다.');
            }
            else
            {
                // 응답 메시지 전송
                sendResponse(socket, 'login', '404', '상대방의 로그인 ID를 찾을 수 없습니다.');
            }
        }
    });
    
    socket.on("login", function(loginInfo)
    {
        console.log("login 이벤트를 받았습니다.");
        console.dir(loginInfo);
        
        console.log("접속한 소켓의 ID : " + socket.id);
        if (login_ids[loginInfo.id])
        {
            sendResponse(socket, 'login', '404', '이미 로그인되었습니다.');
            return;
        }
        
        login_ids[loginInfo.id] = socket.id;
        socket.login_id = loginInfo.id;
        
        console.log("접속한 클라이언트 ID 개수 : %d", Object.keys(login_ids).length);
        
        // 응답 메시지 전송
        sendResponse(socket, 'login', '200', '로그인되었습니다.');
    });
    
    socket.on("logout", function(logoutInfo)
    {
        console.log("logout 이벤트를 받았습니다.");
        console.dir(logoutInfo);
        
        if (login_ids[logoutInfo.id])
        {
            // 로그인 정보 제거
            delete login_ids[logoutInfo.id];
            
            // 응답 메시지 전송
            sendResponse(socket, 'logout', '200', '로그아웃 되었습니다.');
        }
        else
        {
            // 응답 메시지 전송
            sendResponse(socket, 'logout', '404', '로그인 되어 있지 않습니다.');
        }
    });
    
    socket.on("room", function(room)
    {
        console.log('room 이벤트를 받았습니다.');
        console.dir(room);
        
        if (room.command == 'create')
        {
            if (io.sockets.adapter.rooms[room.roomId])
            {
                console.log("방이 이미 만들어져 있습니다.");
            }
            else
            {
                console.log("방을 새로 만듭니다.");
                
                socket.join(room.roomId);
                
                var curRoom = io.sockets.adapter.rooms[room.roomId];
                curRoom.id = room.roomId;
                curRoom.name = room.roomName;
                curRoom.owner = room.roomOwner;
            }
        }
        else if (room.command == 'update')
        {
            var curRoom = io.sockets.adapter.rooms[room.roomId];
            curRoom.id = room.roomId;
            curRoom.name = room.roomName;
            curRoom.owner = room.roomOwner;
        }
        else if (room.command == 'delete')
        {
            socket.leave(room.roomId);
            
            if (io.sockets.adapter.rooms[room.roomId])
            {
                delete io.sockets.adapter.rooms[room.roomId];
            }
            else
            {
                console.log("방이 만들어져 있지 않습니다.");
            }
        }
        
        var roomList = getRoomList();
        var output = {command : 'list', rooms : roomList};
        console.log("클라이언트로 보낼 데이터 : " + JSON.stringify(output));
        
        io.sockets.emit('room', output);
    });
});

function sendResponse(socket, command, code, message) {
    var statusObj = {command : command, code : code, message : message};
    socket.emit('response', statusObj);
}

function getRoomList()
{
    console.dir(io.sockets.adapter.rooms);
    
    var roomList = [];
    
    Object.keys(io.sockets.adapter.rooms).forEach(function(roomId) 
    {
        console.log("current room id : " + roomId);
        var outRoom = io.sockets.adapter.rooms[roomId];
        
        var foundDefault = false;
        var index = 0;
        Object.keys(outRoom.sockets).forEach(function(key)
        {
            console.log('#' + index + ' : ' + key + ', ' + outRoom.sockets[key]);
            
            if (roomId == key)
            {
                foundDefault = true;
                console.log("this is default room");
            }
            
            index++;
        });
        
        if (!foundDefault)
        {
            roomList.push(outRoom);
        }
    });
    
    console.log("[ROOM LIST]");
    console.dir(roomList);
    
    return roomList;
}