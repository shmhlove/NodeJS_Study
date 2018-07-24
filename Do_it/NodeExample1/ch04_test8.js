// < 파일 : 버퍼 >

console.log("==============================");

var output = "hello 1";
var buffer1 = new Buffer(10);
var len = buffer1.write(output, "utf8");
console.log("버퍼1의 문자열 : %s", buffer1.toString());

var buffer2 = new Buffer(output, "utf8");
console.log("버퍼2의 문자열 : %s", buffer2.toString());

console.log("Is Buffer Type : %s", Buffer.isBuffer(buffer1));

var str1 = buffer1.toString("utf8", 0, Buffer.byteLength(output));
console.log("toString으로 원하는 길이만큼 읽기 : %s", str1);

var str2 = buffer1.toString("utf8");
console.log("toString으로 전체 길이만큼 읽기 : %s", str2);

buffer1.copy(buffer2, 0, 0, len);
console.log("버퍼1를 복사한 후의 버퍼2의 문자열 : %s", buffer2.toString("utf8"));

var buffer3 = Buffer.concat([buffer1, buffer2]);
console.log("버퍼1과 버퍼2 이어붙인 후 문자열 : %s", buffer3.toString("utf8"));

console.log("==============================");