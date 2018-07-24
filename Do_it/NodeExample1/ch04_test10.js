console.log("==============================");

var FileSystem = require("fs");

var inName = "./outputBySync.txt";
var outName = "./outputByPipeStream.txt";

FileSystem.exists(outName, function(exists)
{
    var copyFile = function()
    {
        var inFile = FileSystem.createReadStream(inName, {flags: "r"});
        var outFile = FileSystem.createWriteStream(outName, {flags: "w"});
        inFile.pipe(outFile);
        console.log("파일복사 : %s -> %s", inName, outName);

        console.log("==============================");  
    };
    
    if (exists)
    {
        FileSystem.unlink(outName, function(err)
        {
            if (err)
            {
                throw err;
            }
            
            console.log("파일 삭제함 : %s", outName);
            copyFile();
        });
    }
    else
    {
        copyFile();
    }
});
