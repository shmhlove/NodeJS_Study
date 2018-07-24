// < 파일 : 쓰기(싱크, 어싱크) >

console.log("==============================");

var FileSystem = require("fs");
var err = FileSystem.writeFileSync("./outputBySync.txt", "Sync Hello Node.js");
if (err)
{
    console.log(err);
}
else
{
    console.log("outputBySync.txt파일에 데이터 쓰기 완료");
}

console.log("==============================");

FileSystem.writeFile("./outputByAsync.txt", "Async Hello Node.js", function(err)
{
    if (err)
    {
        console.log(err);
    }
    else
    {
        console.log("outputByAsync.txt파일에 데이터 쓰기 완료");
    }
    
    line();
});

var line = function() { console.log("=============================="); };