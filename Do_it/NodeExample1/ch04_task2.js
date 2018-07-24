// 소켓 서버와 클라이언트 기능을 노드로 구성하여 
// 클라에서 데이터를 보내면 서버에서 다시 돌려주는 기능을 만들어 보세요.

// npm install net --save
var net = require("net");

function connectServer()
{
    var client = net.connect({port: 3535, host: "localhost"}, function()
    {
        console.log("[Client] Connect To Server!!");
        console.log("\tlocal = %s:%s", this.localAddress, this.localPort);
        console.log("\tremote = %s:%s", this.remoteAddress, this.remotePort);
        
        this.setTimeout(500);
        this.setEncoding("utf8");
        this.on("data", function(data)
        {
            console.log("[Client] Receive : %s", data.toString());
            this.end();
        });
        
        this.on("end", function()
        {
            console.log("[Client] Disconnected Server");
        });
        
        this.on("error", function(err)
        {
            console.log("[Client] Socket Error : %s", JSON.stringify(err));
        });
        
        this.on("timeout", function()
        {
            console.log("[Client] Socket Timeout");
        });
        
        this.on("close", function()
        {
            console.log("[Client] Socket Closed");
        });
    });
    
    return client;
}

function createServer()
{
    var server = net.createServer(function(client)
    {
        console.log("[Server] Connect To Client!!");
        console.log("\tlocal = %s:%s", client.localAddress, client.localPort);
        console.log("\tremote = %s:%s", client.remoteAddress, client.remotePort);
        
        client.setTimeout(500);
        client.setEncoding("utf8");
        
        client.on("data", function(data)
        {
            console.log("[Server][Client:%s] Receive : %s", client.remotePort, data.toString());
            sendData(client, data.toString());
            
            server.close();
        });
        
        client.on("end", function()
        {
            console.log("[Server] Client Disconnected");
        });
        
        client.on("error", function(err)
        {
            console.log("[Server] Client Socket Error : %s", JSON.stringify(err));
        });
        
        client.on("timeout", function()
        {
            console.log("[Server] Client Socket Timeout");
        });
    });
    
    server.on("close", function()
    {
        console.log("[Server] Server Closed");
    });
    
    server.on("error", function(err)
    {
        console.log("[Server] Server Error : %s", JSON.stringify(err));
    });
    
    return server;
};

function sendData(socket, data)
{
    var succeed = false == socket.write(data);
    if (false == succeed)
    {
        (function(socket, data)
        {
            socket.once("drain", function()
            {
                sendData(socket, data);
            });
        })(socket, data);
    }
};

var server = createServer();
server.listen(3535, function()
{
    console.log("[Server] Start Server listening : %s", JSON.stringify(server.address()));
});

var client1 = connectServer();
sendData(client1, "전송 테스트");