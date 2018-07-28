var fs = require("fs");
fs.open("./package.json", "r", function(err, fd)
{
    if (err)
    {
        console.log(err);
        return;
    }
    
    // 버퍼의 크기를 문서 전체로 하고 싶은데...
    // -> stat로 파일크기를 가져와서 버퍼크기를 설정
    var buf = Buffer(fs.statSync("./package.json").size);
    fs.read(fd, buf, 0, buf.length, null, function(err, bytesRead, buffer)
    {
        if (err)
        {
            console.log(err);
            return;
        }
        
        console.log(buffer.toString("utf8", 0, bytesRead));
        
        fs.close(fd, function()
        {
            console.log("파일 열고, 파일 닫기 완료");
        }); 
    });
});