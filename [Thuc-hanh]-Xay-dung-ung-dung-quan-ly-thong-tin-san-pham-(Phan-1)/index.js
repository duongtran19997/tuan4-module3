const mysql = require('mysql');
const http = require('http');
const buffer = require("buffer");

const connection = mysql.createConnection({
    user:'root',
    password:'password',
    host:'localhost',
    port:'3305',
    database:'manager',
    charset:'utf8_general_ci'
});

connection.connect(err=>{
    if(err){
        console.log(err);
    }else{
        console.log('connect success')
    }
})


const sqlCreateTable = "create table if not exists products (id INT NOT NULL PRIMARY KEY AUTO_INCREMENT ,name varchar(30) not null, price INT NOT NULL)";
connection.query(sqlCreateTable,(err)=>{
    if(err){
        console.log(err.message);
    }else{
        console.log('create table success')
    }
});

const server = http.createServer(async(req, res) => {
    try{
        if(req.url==='/product/create'&& req.method ==='POST'){
            const buffers = [];
            for await (const chunk of req){
                buffers.push(chunk)
            }
            const data = Buffer.concat(buffers).toString()
            console.log(data +'123')
            const product = JSON.parse(data);
            const price = parseInt(product.price)
            console.log('product'+ product);
            const sqlCreate = `INSERT INTO products(name, price) VALUES ('${product.name}', ${price});`;
            connection.query(sqlCreate, (err, results, fields) => {
                if (err) throw err;
                res.end(JSON.stringify(product))
            });
        }
    }catch (e){
        return res.end(e.message)
    }
})

server.listen(3000,()=>{
    console.log('server run at 3000')
})