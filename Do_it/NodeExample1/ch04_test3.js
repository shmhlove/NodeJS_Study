// < 이벤트 : 이벤트 발생 >

console.log("==============================");

process.on('tick', function(count)
{
    console.log("tick 이벤트 발생함 : %s", count);
    line();
});

console.log("2초 후 tick 이벤트 전달 시도함");
setTimeout(function()
{
    process.emit('tick', '2');
}, 2000);

var line = function() { console.log("=============================="); };