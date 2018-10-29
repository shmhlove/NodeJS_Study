// < console : timer >
/*
    * console.time() ~ console.timeEnd()로 경과시간 체크
*/

var result = 0;

console.time("check_time");

for (var i = 0; i< 100000; ++i)
{
    result += i;
}

console.timeEnd("check_time");
console.log('Result : %d', result);