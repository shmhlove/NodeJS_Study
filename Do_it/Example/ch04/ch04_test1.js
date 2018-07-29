// < url 모듈 >

console.log("==============================");

var url = require("url");

var urlObject = url.parse("https://search.naver.com/search.naver?where=nexearch&query=cryptocurrency&sm=tab_stc");

var urlString = url.format(urlObject);

console.log("URL : %s", urlString);
console.dir(urlObject);

console.log("==============================");

var queryString = require("querystring");
var param = queryString.parse(urlObject.query);

console.log("요청 파라미터 중 query의 값 : %s", param.query);
console.log("원본 요청 파라미터 : %s", queryString.stringify(param));
console.dir(param);

console.log("==============================");