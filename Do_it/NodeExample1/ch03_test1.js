console.log("==============================");

var bool = true;
console.log("typeof is %s", typeof(bool));

var number = 20;
console.log("typeof is %s", typeof(number));

var string = "SangHo";
console.log("typeof is %s", typeof(string));

var object = {name:"SangHo"};
console.log("typeof is %s", typeof(object));

console.log("==============================");

object = {};
object.bool = true;
object.number = 20;
object["string"] = "String";
object["name"] = "SangHo";
console.dir(object);
console.log("bool : %s, number : %d, string : %s, string : %s", 
            object.bool, object.number, object.string, object.name);

console.log("==============================");

function add(a, b)
{
    return a+b;
}
console.log("named function : %s", add(1,2));

var func = function(a,b)
{
    return a+b;
};
console.log("no named function : %s", func(1,2));

console.log("==============================");

var object = 
{
    name: "SangHo",
    age: 37,
    add: function(a, b)
    {
        return a + b;
    }
};
console.log("name : %s, age : %d, add : %d",
           object.name, object.age, object.add(1,2));
console.dir(object);

console.log("==============================");