// < 비동기 클로져 >

console.log("==============================");

// 정말 비동기로 돌리려면 스레드 분리해야하는가 보다.
function loopping(looppingCount, callback)
{
    console.time("loopTime");
    for (var i = 0; i < looppingCount; ++i) { }
    console.timeEnd("loopTime");
    callback();
    
    var callCount = looppingCount;
    return function()
    {
        console.log("Callcount %d", ++callCount);
    };
}

console.log("---> start");
var history = loopping(10000, function()
{
   console.log("callback"); 
});
console.log("---> end");

console.log("==============================");

var history1 = loopping(100, function() {});
var history2 = loopping(200, function() {});
history1();
history2();
history1();
history2();

console.log("==============================");