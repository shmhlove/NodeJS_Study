/*
    스키마 정의 모듈
*/

var crypto = require("crypto");

var Schema = {};
Schema.createSchema = function(mongoose)
{
    // 스키마 정의
    var UserSchema = mongoose.Schema(
    {
        id: {type:String, required:true, unique:true},
        hashed_password: {type:String, required:true, "default":""},
        salt: {type:String, required:true},
        name: {type:String, index:"hashed", "default":""},
        age: {type:Number, "default":-1},
        created_at: {type:Date, index:{unique:false, "default":Date.now}},
        updated_at: {type:Date, index:{unique:false, "default":Date.now}},
    });
    
    // 스키마 static 메소드 추가
    UserSchema.static("findById", function(id, callback)
    {
        return this.find({id : id}, callback);
    });
    UserSchema.static("findAll", function(callback)
    {
        return this.find({}, callback);
    });
    
    // 스키마 virtual 메소드 추가
    UserSchema.virtual("password").set(function(password)
    {
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
        console.log("virtual password 호출됨 : " + this.hashed_password);
    })
    .get(function() { return this._password });
    
    UserSchema.virtual("info").set(function(info)
    {
        var splitted = info.split(" ");
        this.id = splitted[0];
        this.name = splitted[1];
        console.log("virtual info 설정함 : %s, %s", this.id, this.name);
    })
    .get(function()
    {
        console.log("컬렉션 get 호출됨");
        return this.id + " " + this.name;
    });
    
    // 스키마 모델 인스턴스 메소드 추가
    UserSchema.method("makeSalt", function()
    {
        return Math.round((new Date().valueOf() * Math.random())) + "";
    });
    UserSchema.method("encryptPassword", function(plainText, inSalt)
    {
        if (inSalt)
        {
            return crypto.createHmac("sha1", inSalt).update(plainText).digest("hex");
        }
        else
        {
            return crypto.createHmac("sha1", this.salt).update(plainText).digest("hex");
        }
    });
    UserSchema.method("authenticate", function(plainText, inSalt, hashed_password)
    {
        console.log("authenticate 호출됨 : %s -> %s : %s", plainText, this.encryptPassword(plainText, inSalt), hashed_password)
        
        return this.encryptPassword(plainText, inSalt) == hashed_password;
    });
    
    // 스키마 path 메소드로 속성의 유효성 검사
    UserSchema.path("id").validate(function(id)
    {
        return id.length;
    });
    UserSchema.path("name").validate(function(name)
    {
        return name.length;
    });
    
    console.log("UserSchema 정의함");
    
    return UserSchema;
};

module.exports = Schema;