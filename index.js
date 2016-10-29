// start server on port 8080
var fs = require("fs")
var http = require("http");
var path = require("path");
var injector = require("./injector");
const PORT = 80;


function handleRequest (request, response){
    console.log(request.url);
    if (request.url === "/api") {
        var apidata = JSON.stringify(injector.readModules());
        return response.end(apidata);
    } else if (request.url === "/") {
        request.url = "/public/index.html";
    }

    var filepath = path.join(__dirname, request.url);
    fs.readFile(filepath, "binary", function (err, file){
        if (err) {
            response.writeHead(500, {"Content-Type": "text/plain"});
            return response.end(err + "\n");
        }

        response.writeHead(200);
        response.write(file, "binary");
        response.end();
    });
}

var server = http.createServer(handleRequest);
server.listen(PORT, function (){
    console.log("Index server listening on port", PORT);
});

