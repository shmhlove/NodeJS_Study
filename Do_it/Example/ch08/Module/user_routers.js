/*
    라우터 정의 모듈
*/

var fs = require("fs");

var login = function(req, res)
{
    console.log("POST /process/login 호출됨");
    
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    
    // 데이터베이스 객체 참조
	var database = req.app.get('database');
    
    if (null == database.db)
    {
        var filePath = "./Example/ch07/public/error_database.html";
        fs.exists(filePath, function(exists)
        {
            if (false == exists)
            {        
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write("<h2>데이터베이스 연결 실패</h2>");
                res.write("<div><p>데이터베이스에 연결하지 못했습니다.</p></div>");
                res.end();
            }
            else
            {
                var inStream = fs.createReadStream("./Example/ch07/public/error_database.html");
                inStream.pipe(res);   
            }
        });
    }
    else
    {
        authUser(database, paramId, paramPassword, function(err, docs)
        {
            if (err)
            {
                throw err;
            }
            
            if (docs)
            {
                var userName = docs[0].name;
                
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                
                var context = { userid:paramId, username:userName };
                
                req.app.render("login_success", context, function(err, html)
                {
                    if (err)
                    {
                        console.error("뷰 렌더링 중 오류 발생 : " + err.stack);
                        res.write("<h2>뷰 렌더링 중 오류 발생</h2>");
                        res.write("<p>" + err.stack + "</p>");
                        res.write("<br><br><a href=\"/public/login.html\">다시 로그인하기</a>");
                        res.end();
                    }
                    else
                    {
                        console.log("뷰 렌더링 성공 : " + html);
                        res.end(html);
                    }
                });
            }
            else
            {
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write("<h1>로그인 실패</h1>");
                res.write("<div><p>아이디와 비밀번호를 다시 확인하십시오</p></div>");
                res.write("<br><br><a href=\"/public/login.html\">다시 로그인하기</a>");
                res.end();
            }
        });        
    }
};

var adduser = function(req, res)
{
    console.log("POST /process/adduser 호출됨");
    
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    var paramName = req.body.name || req.query.name;
    
    // 데이터베이스 객체 참조
	var database = req.app.get('database');
    
    if (null == database.db)
    {
        var filePath = "./Example/ch07/public/error_database.html";
        fs.exists(filePath, function(exists)
        {
            if (false == exists)
            {        
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write("<h2>데이터베이스 연결 실패</h2>");
                res.write("<div><p>데이터베이스에 연결하지 못했습니다.</p></div>");
                res.end();
            }
            
            var inStream = fs.createReadStream("./Example/ch07/public/error_database.html");
            inStream.pipe(res);
        });
    }
    else
    {
        registerUser(database, paramId, paramPassword, paramName, function(err,  result)
        {
            if (err)
            {
                throw err;
            }
            
            if (result)
            {
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                
                var context = { userid:paramId, username:paramName };
                
                req.app.render("adduser", context, function(err, html)
                {
                    if (err)
                    {
                        console.error("뷰 렌더링 중 오류 발생 : " + err.stack);
                        res.write("<h2>뷰 렌더링 중 오류 발생</h2>");
                        res.write("<p>" + err.stack + "</p>");
                        res.write("<br><br><a href=\"/public/login.html\">다시 로그인하기</a>");
                        res.end();
                    }
                    else
                    {
                        console.log("뷰 렌더링 성공 : " + html);
                        res.end(html);
                    }
                });
            }
            else
            {
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write("<h1>사용자 추가 실패</h1>");
                res.end();
            }
        });
    }
};

var listuser = function(req, res)
{
    console.log("POST /process/listuser 호출됨");

    // 데이터베이스 객체 참조
	var database = req.app.get('database');
    
    if (null == database.db)
    {
        var filePath = "./Example/ch07/public/error_database.html";
        fs.exists(filePath, function(exists)
        {
            if (false == exists)
            {        
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write("<h2>데이터베이스 연결 실패</h2>");
                res.write("<div><p>데이터베이스에 연결하지 못했습니다.</p></div>");
                res.end();
            }
            
            var inStream = fs.createReadStream("./Example/ch07/public/error_database.html");
            inStream.pipe(res);
        });
    }
    else
    {
        database.UserModel.findAll(function(err, results)
        {
            if (err)
            {
                console.error("사용자 리스트 조회 중 오류 발생 : " + err.stack);
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write("<h1>사용자 리스트 조회 중 오류 발생</h1>");
                res.write("<p>" + err.stack + "</p>");
                res.end();
                return;
            }
            
            if (results)
            {
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                
                var context = { results : results };
                req.app.render("listuser", context, function(err, html)
                {
                    if (err)
                    {
                        console.error("뷰 렌더링 중 오류 발생 : " + err.stack);
                        res.write("<h2>뷰 렌더링 중 오류 발생</h2>");
                        res.write("<p>" + err.stack + "</p>");
                        res.write("<br><br><a href=\"/public/login.html\">다시 로그인하기</a>");
                        res.end();
                    }
                    else
                    {
                        console.log("뷰 렌더링 성공 : " + html);
                        res.end(html);
                    }
                });
            }
            else
            {
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write("<h1>사용자 리스트 조회 실패</h1>");
                res.end();
            }
        });
    }
};

// 사용자를 인증하는 함수 : 아이디로 먼저 찾고, 비밀번호를 비교
var authUser = function(database, id, password, callback)
{
    console.log("authUser 호출됨");
    
    database.UserModel.findById(id, function(err, results)
    {
        if (err)
        {
            callback(err, null);
            return;
        }
        
        if (0 < results.length)
        {
            console.log("아이디와 일치하는 사용자 찾음");
            
            var user = new database.UserModel({id: id});
            var authenticated = user.authenticate(password, results[0]._doc.salt, results[0]._doc.hashed_password);
            
            if (authenticated)
            {
                console.log("비밀번호 일치함");
                callback(null, results);
                return;
            }
        }
        
        console.log("아이디 [%s], 비밀번호 [%s]가 일치하는 사용자 찾지 못함.", id, password);
        
        callback(null, null);
    });
};

// 사용자를 등록하는 함수
var registerUser = function(database, id, password, name, callback)
{
    console.log("registerUser 호출됨");
    
    var user = new database.UserModel({"id":id, "password":password, "name":name});
    
    user.save(function(err)
    {
        if (err)
        {
            callback(err, null);
            return;
        }
        
        console.log("사용자 데이터 추가함.");
        callback(null, user);
    });
};

module.exports.login = login;
module.exports.adduser = adduser;
module.exports.listuser = listuser;