const http = require('http');
const fs = require('fs')
var server = http.createServer(function(request, response) {
    if (request.url.match(/^\/css\//)) {
        var css = fs.readFileSync('./views/style.css' );
        response.writeHead(200,{"Content-Type": "text/css"});
        response.write(css);
        response.end();
        return;
    }
    var html = fs.readFileSync('./views/login.html');
    response.writeHead(200,{"Content-Type": "text/html"});
    response.write(html);
    response.end();
});
server.listen(9090);