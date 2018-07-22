console.log("ProtoType Object");

console.log("==============================");

// 함수를 이용해서 클래스처럼 만들 수 있다.
function protoTypeObj(name, age)
{
    // this가 인스턴스화 되었는지 체크하는건데 이런 문법은 뭐지??
    if (false == (this instanceof protoTypeObj))
    {
        return new protoTypeObj(name, age);    
    }
    
    this.name = name;
    this.age = age;
    this.printInfo = function()
    {
        console.log("Name is %s And Age is %d", this.name, this.age);
    };
}

// prototype객체를 이용해서 클래스 선언 외부에서 값 혹은 기능을 추가할 수 있다.
protoTypeObj.prototype.X = 10;
protoTypeObj.prototype.Y = 20;
protoTypeObj.prototype.printXY = function()
{
    console.log("X : %d, Y : %d", this.X, this.Y);
};

var SangHo = protoTypeObj("SangHo", 37);
var Natalie = new protoTypeObj("Natalie", 22);

SangHo.printInfo();
SangHo.printXY();
Natalie.printInfo();
Natalie.printXY();

console.log("==============================");