// < 클래스 화 : protoType>

console.log("ProtoType Object");

console.log("==============================");

// 함수를 이용해서 클래스처럼 만들 수 있다.
function Class(name, age)
{
    // this가 인스턴스화 되었는지 체크하는건데 이런 문법은 뭐지??
    if (false == (this instanceof Class))
    {
        return new Class(name, age);    
    }
    
    this.name = name;
    this.age = age;
    
    this.printInfo = function()
    {
        console.log("Name is %s And Age is %d", this.name, this.age);
    };
}

// 클래스 선언 외부에서 값 혹은 기능을 추가할 수 있다.
Class.prototype.X = 10;
Class.prototype.Y = 20;
Class.prototype.printXY = function()
{
    console.log("X : %d, Y : %d", this.X, this.Y);
};

var SangHo = Class("SangHo", 37);
var Natalie = new Class("Natalie", 22);

SangHo.printInfo();
SangHo.printXY();
Natalie.printInfo();
Natalie.printXY();

console.log("==============================");