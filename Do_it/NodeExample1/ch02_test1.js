// console의 time

var result = 0;

console.time("check_time");

for (var i = 0; i< 100000; ++i)
{
    result += i;
}

console.timeEnd("check_time");
console.log('Result : %d', result);