// < 모듈화 : 기본 >
/*
    * module.exports 활용 2
    
    * 테스트
        -> 그냥 실행
*/

var userModule = require("./ch07_test3_module_user");

console.dir(userModule);

var showUser = function()
{
    return userModule().name + ", " + "No Group";
};

console.log("사용자 정보 : %s", showUser());