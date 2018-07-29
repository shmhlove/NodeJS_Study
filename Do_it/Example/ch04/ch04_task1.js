// < 4장 도전과제 1 >
// 파일의 내용을 한 줄씩 읽어 들여 화면에 출력하는 기능을 만들어보세요.

var FileSystem = require("fs");

FileSystem.readFile("./outputByAsync.txt", "utf8", function(err, Data)
{
    if (err)
    {
        throw err;
    }
    
    var array = Data.toString().split("\n");
    array.forEach(function(item, index)
    {
        console.log(item);
    });
    
    console.log("==============================");
    
    nextProcess();
});

var nextProcess = function()
{
    var Readline = require('readline');
    
    var rl = Readline.createInterface(
    {
        input: FileSystem.createReadStream('./outputByAsync.txt'),
        output: process.stdout
    });
    
    rl.on('line', function(lineData)
    {
        console.log(lineData);
    });
};