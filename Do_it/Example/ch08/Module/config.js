/*
    각종 하드한 정보
*/

module.exports = 
{
    server_port : 3000,
    
    db_url : "mongodb://localhost:27017/login",
    db_schemas: 
    [
        { file:"./user_scheme", collection:"users3", schemaName:"UserSchema", modelName:"UserModel" }
    ],
    
    route_info:
    [
        {file:"./user_routers", path:"/process/login", method:"login", type:"post"},
        {file:"./user_routers", path:"/process/adduser", method:"adduser", type:"post"},
        {file:"./user_routers", path:"/process/listuser", method:"listuser", type:"post"},
    ]
};