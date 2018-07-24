console.log("==============================");

var Calc = require("./ch04_test4_calc");
var calc = new Calc();

console.log("더하기 : %d", calc.add(1,2));
calc.emit('stop');
console.log("%s에 stop 이벤트 전달 함", Calc.title);

console.log("==============================");