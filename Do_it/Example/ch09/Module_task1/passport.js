var local_login = require("./passport_local_login");
var local_signup = require("./passport_local_signup");
var facebook_login = require("./passport_facebook_login");

module.exports = function(app, passport)
{
    console.log("Module_task1/passport 호출됨.");
    
    passport.serializeUser(function(user, done)
    {
        console.log("serializeUser() 호출됨");
        console.dir(user);
        
        done(null, user);
    });
    
    passport.deserializeUser(function(user, done)
    {
        console.log("deserializeUser() 호출됨");
        console.dir(user);
        
        done(null, user);
    });
    
    passport.use("local-login", local_login);
    passport.use("local-signup", local_signup);
    passport.use("facebook-login", facebook_login(app, passport));
};