// < 웹 서버 만들기 : GET 방식으로 다른 웹 사이트의 데이터를 가져오기 >

var http = require("http");

var options = 
{
    host: "www.google.com",
    port: 80,
    path: "/"
};

var resData = "";
var req = http.get(options, function(res)
{
    res.on("data", function(chunk)
    {
        resData += chunk;
    });
    
    res.on("end", function()
    {
        console.log(resData);
    });
});

req.on("error", function(err)
{
    console.log("오류 발생 : " + err.message);
});