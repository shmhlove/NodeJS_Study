// < 디렉토리 관리 >

console.log("==============================");

var FileSystem = require("fs");
FileSystem.mkdir("./docs", 0666, function(err)
{
    if (err)
    {
        throw err;
    }
    
    console.log("새로운 docs 폴더를 만들었습니다.");
    
    FileSystem.rmdir("./docs", function(err)
    {
        if (err)
        {
            throw err;
        }

        console.log("새로운 docs 폴더를 삭제었습니다.");
        console.log("==============================");
    });
});