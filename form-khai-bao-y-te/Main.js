const http = require('http');
const url = require('url');
const fs = require('fs')

const server = http.createServer((req, res) => {
    const urlPath = url.parse(req.url,true,true).pathname
    switch (urlPath) {
        case '/login':
            if(req.method==='GET'){
                fs.readFile('./views/Login.html','utf-8',(err, data) => {
                    if(err){
                        console.log(err.message);
                    }else{
                    res.writeHead(200,'success',{'content-type':'text/html'});
                    res.write(data);
                    return res.end();
                    }
                })
            }
            break;
        case '/':
            if(req.method==='GET'){
                fs.readFile('./views/signup.html','utf-8',(err, data) => {
                    if(err){
                        console.log(err.message);
                    }else{
                        res.writeHead(200,'success',{'content-type':'text/html'});
                        res.write(data);
                        res.end()
                    }
                })
            }
            break;
        case '/home':
            fs.readFile('./views/index.html','utf-8',(err, data) => {
                if(err){
                    console.log(err.message);
                }else{
                    res.writeHead(200,'success',{'content-type':'text/html'});
                    res.write(data);
                    res.end()
                }
            })
            break;
    }
})
server.listen(3000,()=>{
    console.log('server running at 3000')
})