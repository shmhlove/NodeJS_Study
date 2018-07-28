process.on("exit", function()
{
    console.log("Exit 이벤트 발생!!");
});

setTimeout(function()
{
    process.emit("exit");
    process.exit();
}, 2000);

console.log("==============================");

var Calc = require("./Module/eventModule");
var calc = new Calc();
calc.emit('stop');

console.log("==============================");

var util = require("util");
var eventEmitter = require("events").EventEmitter;

var Test = function()
{
    this.on('stop', function()
    {
        console.log("calculator에 stop 이벤트 전달 됨");
    });
    
    this.add = function(a, b)
    {
        return a + b;
    };
};
util.inherits(Test, eventEmitter);

var test = new Test();
test.emit('stop');

console.log("==============================");