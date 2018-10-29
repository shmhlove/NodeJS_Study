// < 사용자 모듈 >
/*
    * 사용자 모듈을 만드는 두가지 방법
        -> exports.add = function(a, b) { };
        -> module.exports = object;
        
    * 모듈 로드방식 2가지 방법
        -> var module = require("상대경로/*.js");
        -> var modules = require("상대경로");
*/

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

modules = require("./Module");
console.log("index 모듈 분리 후 : %d", modules.add(1, 2));