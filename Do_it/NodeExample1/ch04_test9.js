console.log("==============================");

var FileSystem = require("fs");
var inFile = FileSystem.createReadStream("./outputBySync.txt", {flags: 'r'});
var outFile = FileSystem.createWriteStream("./outputByStream.txt", {flags: 'w'});

inFile.on("data", function(data)
{
    console.log("읽어 들인 데이터 : %s", data);
    outFile.write(data);
});

inFile.on("end", function()
{
    console.log("파일 읽기 종료");
    outFile.end(function()
    {
        console.log("파일 쓰기 종료");
        line();
    });
});

var line = function() { console.log("=============================="); };