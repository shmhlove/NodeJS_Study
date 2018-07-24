// < 사용자 모듈 >

var calc = {};

calc.add = function(a, b)
{
    return a + b;  
};

console.log("모듈 분리 전 : %d", calc.add(1, 2));

module = require("./ch02_test4_module_type1");
console.log("모듈(type1) 분리 후 : %d", module.add(1, 2));

module = require("./ch02_test4_module_type2");
console.log("모듈(type2) 분리 후 : %d", module.add(1, 2));

module = require("./ch02_module");
console.log("index 모듈 분리 후 : %d", module.add(1, 2));