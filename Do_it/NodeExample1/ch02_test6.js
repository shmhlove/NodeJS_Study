// 내장모듈

// 문서 : http://nodejs.org/api

// os 모듈
/*
hostname() : 운영체제의 호스트 이름을 알려 줍니다.
totalmem() : 시스템의 전체 메모리 용량을 알려 줍니다.
freemem() : 시스템에서 사용 가능한 메모리 용량을 알려 줍니다.
cpus() : cpu 정보를 알려 줍니다.
networkInterfaces() : 네트워크 인터페이스 정보를 담은 배열 객체를 반환합니다.
*/

var os = require("os");
console.log("시스템의 hostname : %s", os.hostname());
console.log("시스템의 메모리 : %d / %d", os.freemem(), os.totalmem());
console.log("시스템의 cpu 정보\n");
console.dir(os.cpus());
console.log("시스템의 네트워크 인터페이스 정보\n");
console.dir(os.networkInterfaces());

console.log("==============================");

// path 모듈
/*
join() : 여러개의 이름들을 모두 합쳐 하나의 파일 패스로 만듭니다.
dirname() : 파일 패스에서 디렉터리 이름을 반환합니다.
basename() : 파일 패스에서 파일의 확장자를 제외한 이름을 반환합니다.
extname() : 파일 패스에서 파일의 확장자를 반환합니다.
*/

var path = require("path");

var directories = ["users", "hoya", "docs"];
var docsDir = directories.join(path.sep);
console.log("path.sep : %s", path.sep);
console.log("문서 디렉토리 : %s", docsDir);

var curPath = path.join("/Users/hoya", "notepad.exe");
console.log("파일 경로 : %s", curPath);

console.log("==============================");

var filename = "/Users/hoya/notepad.exe";
console.log("디렉토리 : %s", path.dirname(filename));
console.log("파일이름 : %s", path.basename(filename));
console.log("확장자 : %s", path.extname(filename));

console.log("==============================");