var facebookStrategy = require('passport-facebook').Strategy;
var config = require("./config");

module.exports = function(app, passport) {
    return new facebookStrategy(
{
    clientID : config.facebook.clientID,
    clientSecret : config.facebook.clientSecret,
    callbackURL : config.facebook.callbackURL,
    profileFields : ["id", "emails", "displayName", "name", "gender", "profileUrl" ]
}, function(accessToken, refreshToken, profile, done)
{
    console.log("passport_facebook_login 호출됨");
    console.dir(profile);
    
    var options = 
    {
        criteria : {"facebook.id" : profile.id}
    };
    
    var database = app.get("database");
    database.UserModel.findOne(options, function (err, user)
    {
        console.log("passport_facebook_login : database.UserModel.load(options, function(err, user)");
        
        if (err)
        {
            return done(err);
        }

        if (!user)
        {
            var user = new database.UserModel(
            {
                "name" : profile.displayName,
                "email" : profile.emails[0].value,
                "password" : "facebook", 
                "provider" : "facebook",
                "authToken" : accessToken,
                "facebook" : profile._json
            });

            user.save(function(err)
            {
                console.log("passport_facebook_login : user.save(function(err)");
                if (err)
                {
                    console.log(err);
                }
                return done(err, user);
            });
        }
        else
        {
            return done(err, user);
        }
    });
});
};