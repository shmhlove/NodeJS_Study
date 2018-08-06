// < 웹 서버 만들기 : [클라이언트] GET 방식으로 다른 웹 사이트의 데이터를 가져오기 >
/*
    이번에는 클라이언트가 되어 
    http의 get함수를 이용해 GET 방식으로 웹페이지의 응답을 받는다.
    get함수의 파라미터에는 options의 JSON형태의 오브젝트를 인자로 넘겨줘야하는데
    호스트 주소와 포트와 서브경로가 포함된다.
    
    데이터를 받는 것은 res에서 data 이벤트로 지속해서 발생하며, 응답을 모두받으면 end이벤트가 발생한다.
*/

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