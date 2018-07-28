var util = require("util");
var eventEmitter = require("events").EventEmitter;

var Calc = function()
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
util.inherits(Calc, eventEmitter);

module.exports = Calc;
module.exports.title = "calculator";