// 로그 처리 모듈 ( npm install winston --save )
var winston = require("winston");
// 로그 일별 처리 모듈 ( npm install winston-daily-rotate-file --save )
var winstonDaily = require("winston-daily-rotate-file");
// 시간 처리 모듈 ( npm install moment --save )
var moment = require("moment");

function timeStampFormat()
{
    // 2016-05-01 20:14:28.500 +0900
    return moment.format("YYYY-MM-DD HH:mm:ss.SSS ZZ");
};

//var logger = new (winston.Logger)({
var logger = winston.createLogger(
{
    transports:
    [
        new (winstonDaily)(
        {
            name: "info-file",
            filename: "./log/server",
            datePattern: "YYYY-MM-DD.log",
            colorize: false,
            maxsize: 50000000,
            maxFiles: 1000,
            level: "info",
            showLevel: true,
            json: false,
            timestamp: timeStampFormat
        }),
        new (winston.transports.Console)(
        {
            name: "debug-console",
            colorize: true,
            level: "debug",
            showLevel: true,
            json: false,
            timestamp: timeStampFormat
        })
    ],
    exceptionHandlers:
    [
        new (winstonDaily)(
        {
            name: "exception-file",
            filename: "./log/exception",
            datePattern: "YYYY-MM-DD.log",
            colorize: false,
            maxsize: 50000000,
            maxFiles: 1000,
            level: "error",
            showLevel: true,
            json: false,
            timestamp: timeStampFormat
        }),
        new (winston.transports.Console)(
        {
            name: "exception-console",
            colorize: true,
            level: "debug",
            showLevel: true,
            json: false,
            timestamp: timeStampFormat
        })
    ],
    
    exitOnError: false,
});

logger.debug("Test Debug Log!!");
logger.info("Test info Log!!");
//logger.notice("Test notice Log!!");
//logger.warning("Test warning Log!!");
logger.error("Test error Log!!");
//logger.crit("Test crit Log!!");
//logger.alert("Test alert Log!!");
//logger.emerg("Test emerg Log!!");

module.exports = logger;
module.exports.title = "Logger";