// < 모듈화 : 기본 >
/*
    * require 동작방식의 이해
    
    * 테스트
        -> 그냥 실행
*/

var require = function(path)
{
    var exports = 
    {
        getUser : function()
        {
            return {id: "test01", name: "소녀시대"};
        },
        group : {id: "group01", name: "친구"}
    };
    
    return exports;
};

var userModule = require("...");

var showUser = function()
{
    return userModule.getUser().name + ", " + userModule.group.name;
};

console.log("사용자 정보 : %s", showUser());