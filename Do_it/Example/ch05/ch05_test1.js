// < 웹 서버 만들기 1 >

var http = require("http");
var server = http.createServer();

//var port = 3000;
//server.listen(port, function()

var host = "127.0.0.1";
//var host = "192.168.0.16";
var backlog = "50000";
var port = 3000;
server.listen(port, host, backlog, function()
{
    console.log("웹 서버가 시작되었습니다!!(port : %d)", port);
    
//    server.close(function()
//    {
//        console.log("웹 서버 종료를 명령하였습니다.!!(port : %d)", port);
//    });
});

server.on("connection", function(socket)
{
    console.log("웹 서버 연결 이벤트가 도착했습니다.(port : %d)", port);
});

server.on("request", function(req, res)
{
/* MIME Type
    text/plain
    text/html
    text/css
    text/xml
    image/jpeg, image/png
    video/mpeg, audio/mp3
    application/zip
*/
    
//    방법 1    
//    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
//    res.write("<!DOCTYPE html>");
//    res.write("<html>");
//    res.write("<head>");
//    res.write("<title> 응답 페이지</title>");
//    res.write("</head>");
//    res.write("<body>");
//    res.write("<h1>노드제이에스로부터의 응답 페이지</h1>");
//    res.write("</body>");
//    res.write("</html>");
//    res.end();

//    방법 2
//    var fs = require("fs");
//    var fd = fs.createReadStream("./test1.html", { encoding: "utf8" });
//    fd.pipe(res);
    
//    방법 3
    var fs = require("fs");
    fs.readFile("./test1.html", "utf8", function(err, data)
    {
        res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
        res.write(data);
        res.end();
    });
    
    console.log("웹 서버 요청 이벤트가 도착했습니다.(port : %d)", port);
});

server.on("close", function()
{
    console.log("웹 서버 종료 이벤트가 도착했습니다.(port : %d)", port);
});