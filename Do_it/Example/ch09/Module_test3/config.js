/*
    각종 하드한 정보
*/

module.exports = 
{
    server_port : 3000,
    
    db_url : "mongodb://localhost:27017/shopping",
    db_schemas: 
    [
        { file:"./user_scheme", collection:"users6", schemaName:"UserSchema", modelName:"UserModel" }
    ],
    
    route_info:
    [
    ],
    
    facebook : 
    {
        clientID : "222461698623162",
        clientSecret : "d11df77b7e40b27705c4f81579254001",
        callbackURL : "https://localhost:3000/auth/facebook/callback"
    }
};