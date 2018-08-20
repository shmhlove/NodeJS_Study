// < 모듈화 : 기본 >
/*
    * exports 활용
    
    * 테스트
        -> 그냥 실행
*/

exports.getUser = function(id, name) 
{
    return { id: "test01", name: "소녀시대" };
}

exports.group = { id: "group01", name: "친구" };