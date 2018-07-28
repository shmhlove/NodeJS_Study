var url = require("url");
var urlObject = url.parse("https://www.google.co.kr/search?source=hp&ei=lmVZW4nWCI2g-Qbgko2QCQ&q=cryptocurrency&oq=cryptocurrency&gs_l=psy-ab.3..35i39k1j0l9.346.6868.0.7074.15.13.0.0.0.0.365.1800.0j4j2j2.8.0....0...1c.1.64.psy-ab..7.8.1800.0..0i131k1j0i10k1.0.Q_KTF6_-qMA");

console.log("==============================");
var curStr = url.format(urlObject);
console.log(curStr);
console.log("==============================");
console.dir(urlObject);
console.log("==============================");
var queryString = require("querystring");
var queryObject = queryString.parse(urlObject.query)
console.log("%s", queryObject.query);
console.log("%s", queryString.stringify(queryObject));
console.log("==============================");
console.log("%s", urlObject.host);
console.log("==============================");
