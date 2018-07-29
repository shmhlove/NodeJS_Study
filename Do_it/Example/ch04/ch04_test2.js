// < 이벤트 >

console.log("==============================");

process.on('exit', function()
{
    console.log("3. exit 이벤트 발생함");
    line();
});

console.log("1. 2초 후에 프로세스 종료 시도");
setTimeout(function()
{
    console.log("2. 프로세스 종료");
    process.exit();
}, 2000);

var line = function() { console.log("=============================="); };