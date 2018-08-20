// < 모듈화 : 기본 >
/*
    * 모듈화 패턴 2 : 인스턴스 객체 할당 패턴
    
    * 테스트
        -> 그냥 실행
*/

function User(id, name)
{
    this.id = id;
    this.name = name;
};

User.prototype.getUser = function()
{
    return {id:this.id, name:this.name};
};

User.prototype.group = {id: "group1", name: "친구"};

User.prototype.printUser = function()
{
    console.log("user 이름 : %s, group 이름 : %s", this.name, this.group.name);
};

// exports방식
// exports.user = new User("this01", "소녀시대");

// module방식
module.exports = new User("this01", "소녀시대");