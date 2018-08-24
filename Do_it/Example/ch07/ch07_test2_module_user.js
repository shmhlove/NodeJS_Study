// < 모듈화 : 기본 >
/*
    * module.exports 활용 1
    
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