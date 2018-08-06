// < 웹 서버 만들기 : [클라이언트] POST 방식으로 다른 웹 사이트의 데이터를 가져오기 >
/*
    이번에는 http의 request를 이용해서 POST방식으로 요청을 해본다.
    http의 get의 GET방식과 같은 방식으로 데이터를 받게 된다.
*/

var http = require("http");

var options = 
{
    host: "www.google.com",
    port: 80,
    method: "POST",
    path: "/",
    headers: {}
};

var resData = "";
var req = http.request(options, function(res)
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

options.headers["Content-Type"] = "application/x-www-form-urlencoded";
req.data = "q=actor";
options.headers["Content-Length"] = req.data.length;

req.on("error", function(err)
{
    console.log("오류발생 : " + err.message);
});

req.write(req.data);
req.end();