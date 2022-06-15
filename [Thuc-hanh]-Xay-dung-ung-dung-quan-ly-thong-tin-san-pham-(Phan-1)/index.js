const mysql = require('mysql');
const http = require('http');
const qs = require('qs')
const util = require('util');


const connection = mysql.createConnection({
    user: 'root',
    password: 'password',
    host: 'localhost',
    port: '3305',
    database: 'manager',
    charset: 'utf8_general_ci'
});

// convert query to promise
const query = util.promisify(connection.query).bind(connection);


// connection.connect(err=>{
//     if(err){
//         console.log(err);
//     }else{
//         console.log('connect success');
//         const sqlCreateTable = "create table if not exists products (id INT NOT NULL PRIMARY KEY AUTO_INCREMENT ,name varchar(30) not null, price INT NOT NULL)";
//         connection.query(sqlCreateTable,(err)=>{
//             if(err){
//                 console.log(err.message);
//             }else{
//                 console.log('create table success')
//             }
//         });
//     }
// })


const server = http.createServer(async (req, res) => {
    try {
        const sqlCreateTable = "create table if not exists products (id INT NOT NULL PRIMARY KEY AUTO_INCREMENT ,name varchar(30) not null, price INT NOT NULL)";
        let results = await query(sqlCreateTable);
        console.log('them bang thanh cong')
    } catch (err) {
        console.log(err)
    }

    try {
        if (req.url === '/product/create' && req.method === 'POST') {
            let data = '';
            console.log('123')
            req.on('data', chunk => {
                data += chunk;
                console.log(data+'123');
            })
            let product = ''
            req.on('end', async() => {
                product = qs.parse(data)
                console.log(product);
                const sqlCreate = `INSERT INTO products(name, price) VALUES ('${product.name}', ${product.price});`;
                let result = await query(sqlCreate);
                console.log(`them ${product.name} thanh cong`)
            });
            res.end('them thanh cong')
        }
    } catch (e) {
        return res.end(e.message)
    }
})

server.listen(3000, () => {
    console.log('server run at 3000')
})
