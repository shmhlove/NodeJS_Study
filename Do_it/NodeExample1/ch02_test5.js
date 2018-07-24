// < 외장 모듈 >

// npm install nconf 를 이용해서 nconf를 설치해야 환경변수를 확인할 수 있음.
/*
    cd [install path]
    npm init
    npm uninstall nconf
    npm install nconf --save
*/

// npm 명령시 방화벽에 막혀 있는 경우
/*
    npm config set proxy [프록시 서버의 호스트이름과 포트]
    npm config set https-procy [프록시 서버의 호스트이름과 포트]
    npm config set strict-ssl false
*/

var systemConf = require("nconf");

systemConf.env();
console.dir(systemConf);
console.log("OS 환경변수 : %s", systemConf.get("OS"));
console.log("버전 : %s", systemConf["version"]);