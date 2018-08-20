// < 모듈화 : 기본 >
/*
    * exports와 module.exports 동시에 사용해보기
    
    * 테스트
        -> 그냥 실행
*/

module.exports = 
{
    getUser : function() 
    {
        return { id: "test01", name: "소녀시대" };
    },

    group : { id: "group01", name: "친구" }
};

// 무시됨
exports.group = { id: "group02", name: "가족" };

// 접근하면 오류발생
exports.group_diff = { id: "group03", name: "동료" };