// < 웹 서버 만들기 3 >

var http = require("http");
var server = http.createServer();

var host = "127.0.0.1";
var port = 3000;
server.listen(port, host, function()
{
    console.log("start server");
});

server.on("request", function(req, res)
{
//    var fs = require("fs");
//    var data = fs.createReadStream("./house.jpg", {flags: "r"});
//    data.pipe(res);
    
    var fs = require("fs");
    fs.readFile("./house.jpg", function(err, data)
    {
        res.writeHead(200, {"Content-Type": "image/jpeg"});
        res.write(data);
        res.end();
    });
    
    console.log("request client");
});