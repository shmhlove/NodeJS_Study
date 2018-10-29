// < 전역객체 : process >
/*
    * argv, env, exit 활용 예
*/

for (var i=0; i<process.argv.length; ++i)
{
    console.log("%d : %s", i, process.argv[i]);
}

process.argv.forEach(function(item, index)
{
    console.log(index + " : " + item);
});

//console.dir(process.env);
console.log("User : %s", process.env['USER']);

process.exit();