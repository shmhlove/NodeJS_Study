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
        email: {type:String, "default":""}
        , hashed_password: {type:String, required:true, "default":""}
        , salt: {type:String, required:true}
        , name: {type:String, index:"hashed", "default":""}
        , created_at: {type:Date, index:{unique:false, "default":Date.now}}
        , updated_at: {type:Date, index:{unique:false, "default":Date.now}}
    });
    
    // 스키마 static 메소드 추가
    // static : 인스턴스 없이 모델 객체에서 바로 접근하여 사용할 수 있는 함수를 등록
    UserSchema.static("findByEmail", function(email, callback)
    {
        return this.find({email : email}, callback);
    });
    UserSchema.static("findAll", function(callback)
    {
        return this.find({}, callback);
    });
    
    // 스키마 virtual 메소드 추가
    // virtual : 스키마 내에 password 필드는 없으나 외부에서 password 필드로 접근할 수 있음
	UserSchema.virtual('password').set(function(password) 
    {
	    this._password = password;
	    this.salt = this.makeSalt();
	    this.hashed_password = this.encryptPassword(password);
	    console.log('virtual password 호출됨 : ' + this.hashed_password);
    })
    .get(function() { return this._password });
    
    // 스키마 모델 인스턴스 메소드 추가
    // method : 모델객체에서 생성된 인스턴스로 접근할 수 있는 함수를 등록
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
		if (inSalt)
        {
			console.log('authenticate 호출됨 : %s -> %s : %s', plainText, this.encryptPassword(plainText, inSalt), hashed_password);
			return this.encryptPassword(plainText, inSalt) === hashed_password;
		}
        else
        {
			console.log('authenticate 호출됨 : %s -> %s : %s', plainText, this.encryptPassword(plainText), this.hashed_password);
			return this.encryptPassword(plainText) === this.hashed_password;
		}
    });
    
	// 값이 유효한지 확인하는 함수 정의
	var validatePresenceOf = function(value) {
		return value && value.length;
	};
    
	// 저장 시의 트리거 함수 정의 (password 필드가 유효하지 않으면 에러 발생)
    // 이건 뭐지?? 트리거 함수니깐 스키마가 데이터베이스에 저장될때 호출되는 이벤트 함수인가보다..
	UserSchema.pre('save', function(next) 
    {
		if (!this.isNew)
        {
            return next();
        }
	
		if (!validatePresenceOf(this.password))
        {
			next(new Error('유효하지 않은 password 필드입니다.'));
		}
        else
        {
			next();
		}
	});
    
    // 스키마 path 메소드로 속성의 유효성 검사
    UserSchema.path("email").validate(function(email)
    {
        return email.length;
    }, "email 칼럼의 값이 없습니다.");
    UserSchema.path("hashed_password").validate(function(hashed_password)
    {
        return hashed_password.length;
    }, "hashed_password 칼럼의 값이 없습니다.");
    
    console.log("UserSchema 정의함");
    
    return UserSchema;
};

module.exports = Schema;