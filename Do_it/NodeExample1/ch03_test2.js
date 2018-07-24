// < 데이터 타입 : 배열 >

console.log("==============================");

var array = [];
array.push(1);
array.push(2);
array.push(3);
array.push(true);
array.push("SangHo");
array.push({name:"SangHo", age:37});
array.push(function(a, b)
{
    return a + b;
});

array.forEach(function(item, index)
{
    if ("boolean" == typeof(item))
        console.log("%d : %s", index, item);
    if ("number" == typeof(item))
        console.log("%d : %d", index, item);
    if ("string" == typeof(item))
        console.log("%d : %s", index, item);
    if ("object" == typeof(item))
        console.log("%d : %j", index, item);
    if ("function" == typeof(item))
        console.log("%d : %d", index, item(1,2));
});

console.log("==============================");

// 배열의 마지막요소 뽑아내기
var pop = array.pop();
console.log("pop : %d", pop(1,2));

// 배열의 시작에 요소 넣기
array.unshift(pop);
console.log("unshift : %d", array[0](1,2));

// 배열의 시작요소 뽑아내기
array.shift();
console.log("shift : %d", array[0]);

// 인덱스 범위만큼 제거하기
console.log("before splice lenght : %d", array.length);
array.splice(0, 2);

// 시작 인덱스 부터 요소 삽입 (두번째 인자는 의미가 없어서 undefined 전달)
console.log("after remove splice lenght : %d", array.length);
array.splice(0, undefined, 1, 2, 3, 4, 5);
console.log("after add splice lenght : %d", array.length);

// 인덱스 범위만큼 배열 복사하기
var slice = array.slice(0, 5);
console.log("slice lenght for array : %d", array.length);
console.log("slice lenght for slice : %d", slice.length);

/* push - unshift, pop - shift
push : 배열의 끝에 추가
pop : 배열의 끝을 뽑아내기
unshift : 배열의 시작에 추가
shift : 배열의 시작을 뽑아내기
*/

console.log("==============================");

/* delete
요소의 값만 제거시켜준다.
*/
console.dir(array);
delete array[2];
console.dir(array);

// 공간도 제거
array.splice(2, 1);
console.dir(array);

console.log("==============================");

array = [1,2,3,4,5,6];
array.sort(function(item1, item2)
{
    return item1 < item2;
});
console.dir(array);

console.log("==============================");