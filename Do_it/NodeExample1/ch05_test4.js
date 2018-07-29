// < 웹 서버 만들기 : 스트림에서 조금씩 로드해서 Response 만들기 >

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
    console.log("request client");
    
    var fs = require("fs");
    var fileName = "./house.jpg";
    var fileSize = fs.statSync(fileName).size;
    var data = fs.createReadStream(fileName, { flags: "r" });
    
    res.writeHead(200, {"Content-Type": "image/jpeg"});
    
    var chunk = 0;
    var curSize = 0;
    
    data.on("readable", function()
    {
        if (null == (chunk = data.read()))
            return;
        
        res.write(chunk, "utf8", function(err)
        {
            curSize += chunk.length;
            
            console.log("%d/%d(%f\%)", curSize, fileSize, ((curSize/fileSize) * 100).toFixed(2));
            
            if (curSize >= fileSize)
            {
                res.end();
            }
        });
    });
});

server.on("close", function()
{
    console.log("close server");
});