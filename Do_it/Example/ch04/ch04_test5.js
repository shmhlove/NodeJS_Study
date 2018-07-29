// < 파일 : 읽기(싱크, 어싱크) >

console.log("==============================");

var FileSystem = require("fs");
var data = FileSystem.readFileSync("./package.json", "utf8");
console.log("< Sync Read >\n" + data);

console.log("==============================");

FileSystem.readFile("./package.json", "utf8", function(err, data)
{
    if (err)
    {
        console.log("< ASync Read >\n" + err);
    }
    else
    {
        console.log("< ASync Read >\n" + data);
    }
    
    line();
});

var line = function() { console.log("=============================="); };