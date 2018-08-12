// < 웹 서버 만들기 : 스트림에서 조금씩 로드해서 Response 만들기 >
/*
    fileStream에서 readable이벤트를 받아 res.write를 구성하여 응답할 수 있다.
    readable에서 chunk의 단위는 어떻기 지정하는 건가??
    -> readable의 파라미터인 data의 read함수를 호출할때에 size를 지정할 수 있다.
    -> 단, read함수 호출시 파라미터를 넣지 않으면 65536단위로 읽고, 
       스트림을 모두 read할때까지 readable이벤트가 반복해서 발생하지만
       size를 입력하면 수동으로 readable이벤트를 발생 시켜줘야한다.
*/

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
    var curReadSize = 0;
    
    data.on("readable", function()
    {
        if (null == (chunk = data.read(100)))
        {
            console.log("read data is null");
            return;   
        }
        
        res.write(chunk, "utf8", function(err)
        {
            if (err)
            {
                console.log("res write err" + err);
                return;
            }
            
            curReadSize += chunk.length;
            
            console.log("%d/%d(%f\%)", curReadSize, fileSize, ((curReadSize/fileSize) * 100).toFixed(2));
            
            if (curReadSize >= fileSize)
            {
                res.end();
            }
            else
            {
                data.emit("readable");
            }
        });
    });
});

server.on("close", function()
{
    console.log("close server");
});