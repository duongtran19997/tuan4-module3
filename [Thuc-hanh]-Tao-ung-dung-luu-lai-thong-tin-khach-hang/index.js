const mysql = require('mysql')
const qs = require('qs')
const http = require('http')
const url = require('url')

const connection = mysql.createConnection({
    host:'127.0.0.1',
    port:'3305',
    user:'root',
    password:'password',
    database:'quanlybanhang',
    charset:'utf8_general_ci'
});
connection.connect(function (err) {
    if (err) {
        throw err.stack;
    }
    else {
        console.log("connect success");
    }
});

const server = http.createServer(async (req,res)=>{
    try{
        if (req.url === "/user" && req.method === 'POST') {
            const buffers = [];
            for await (const chunk of req) {
                buffers.push(chunk);
            }
            console.log(buffers);
            const data = Buffer.concat(buffers).toString();
            console.log(data);
            const userData = JSON.parse(data);
           const sql = `INSERT INTO customer(name, address) VALUES ('${userData.name}', '${userData.address}');`;
            connection.query(sql, (err, results, fields) => {
                if (err) throw err;
                res.end("Success");
            });
            res.end("Success");
        }
    }catch (e){
        console.log(e);
    }
})

server.listen(8080, function () {
    console.log('server running at localhost:8080 ')
});
