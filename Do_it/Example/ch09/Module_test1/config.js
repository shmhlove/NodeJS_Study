/*
    각종 하드한 정보
*/

module.exports = 
{
    server_port : 3001,
    
    db_url : "mongodb://172.31.24.134:27017/shopping",
    db_schemas: 
    [
        { file:"./user_scheme", collection:"users5", schemaName:"UserSchema", modelName:"UserModel" }
    ],
    
    route_info:
    [
    ]
};