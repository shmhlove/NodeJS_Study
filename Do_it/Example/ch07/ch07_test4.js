// < 모듈화 : 기본 >
/*
    * exports와 module.exports 동시에 사용해보기
    
    * 테스트
        -> 그냥 실행
*/

var userModule = require("./ch07_test4_module_user");

var showUser = function()
{
    return userModule.getUser().name + ", " + userModule.group.name;
};

console.log("사용자 정보 : %s", showUser());