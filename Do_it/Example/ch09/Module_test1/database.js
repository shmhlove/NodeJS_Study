/*
    데이터베이스 루트
*/

var mongoose = require("mongoose");

// Mongoose로 DB 등록

var database = {};

database.init = function(app, config)
{
    console.log("database 모듈 init 호출됨");
    
    connect(app, config);
};

var connect = function(app, config)
{
    console.log("데이터베이스 연결을 시도합니다.");
    config.db_url = "mongodb://localhost:27017/shopping";
    mongoose.Promise = global.Promise;
    mongoose.connect(config.db_url, { useNewUrlParser: true });
    database.db = mongoose.connection;
    
    database.db.on("error", console.error.bind(console, "Mongoose connection error."));
    
    database.db.on("open", function()
    {
        console.log("데이터 베이스에 연결되었습니다." + config.db_url);
        
        createSchema(app, config);
    });
    
    database.db.on("disconnected", connect);
};

// 스키마 정의 함수
var createSchema = function(app, config)
{
    var schemaLen = config.db_schemas.length;
    console.log("설정에 정의된 스키마의 수 : %d", schemaLen);
    
    for (var i = 0; i < schemaLen; i++)
    {
        var curConfig = config.db_schemas[i];
        var curSchema = require(curConfig.file).createSchema(mongoose);
        
        var collection = database.db.collection(curConfig.collection);
        if (collection)
        {
            collection.drop();
            console.log("%s 기존 컬렉션 제거함", curConfig.collection);
        }
        
        // 제 접속시 에러발생함...
        console.log("%s 모델 정의시도", curConfig.modelName);
        var curModel = mongoose.model(curConfig.collection, curSchema);
        console.log("%s 모델 정의함", curConfig.modelName);
        
        database[curConfig.schemaName] = curSchema;
        database[curConfig.modelName] = curModel;
    }
    
    app.set("database", database);
};

module.exports = database;