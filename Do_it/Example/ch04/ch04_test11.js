// < 간단 HTTP 서버 >

console.log("==============================");

var FileSystem = require("fs");
var Http = require("http");

var server = Http.createServer(function(req, res)
{
    var filePath = "./outputToHttpResponse.txt";
    FileSystem.exists(filePath, function(exists)
    {
        if (false == exists)
        {
            FileSystem.writeFileSync(filePath, "Response Data for Request");
        }
        
        var inStream = FileSystem.createReadStream(filePath);
        inStream.pipe(res);
        
        server.close(function()
        {
            console.log("Close Server!!!");
        });
    });
});

server.listen(7001, "127.0.0.1"); 

console.log("==============================");