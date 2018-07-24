console.log("==============================");

var FileSystem = require("fs");
FileSystem.open("./outputByAsync.txt", "w", function(err, fileData)
{
    if (err)
    {
        throw err;
    }
    
    var buffer = new Buffer("Menual Controll\n");
    FileSystem.write(fileData, buffer, 0, buffer.length, null, function(err, written, buffer)
    {
        if (err)
        {
            throw err;
        }
        
        console.log(err, written, buffer);
        
        FileSystem.close(fileData, function()
        {
            console.log("파일 열고, 데이터 쓰고, 파일 닫기 완료");
            FinishedWrite();
        });
    });
});

var FinishedWrite = function()
{
    console.log("==============================");

    FileSystem.open("./outputByAsync.txt", "r", function(err, fileData)
    {
        if (err)
        {
            throw err;
        }

        var buffer = new Buffer(16);
        console.log("Is Buffer Type : %s", Buffer.isBuffer(buffer));

        FileSystem.read(fileData, buffer, 0, buffer.length, null, function(err, bytesRead, buffer)
        {
            if (err)
            {
                throw err;
            }

            var inString = buffer.toString("utf8", 0, bytesRead);
            console.log("파일에서 읽은 데이터 : %s", inString);

            console.log(err, bytesRead, buffer);

            FileSystem.close(fileData, function()
            {
                console.log("파일 열고, 데이터 읽고, 파일 닫기 완료");
                line();
            });
        });
    });
};

var line = function() { console.log("=============================="); };