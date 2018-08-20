// < 모듈화 : 기본 >
/*
    * exports 활용
    
    * 테스트
        -> 그냥 실행
*/

var userModule = require("./ch07_test1_module_user");

var showUser = function()
{
    return userModule.getUser().name + ", " + userModule.group.name;
};

console.log("사용자 정보 : %s", showUser());