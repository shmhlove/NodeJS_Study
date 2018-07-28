var fs = require("fs");
var data = fs.readFileSync("./package.json", "utf8");
console.log(data);

console.log("==============================");

var source = fs.readFile("./package.js", "utf8", function(err, data)
{
    if (err)
    {
        //console.log(JSON.stringify(err));
        console.dir(err);
    }
    else
    {
        console.log(data);
    }
    
    console.log("==============================");
});