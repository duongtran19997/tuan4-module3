const mysql = require('mysql');
const http = require('http');
const fs = require('fs');
const qs = require('qs');
const url = require("url");
const util = require('util')


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    port: '3305',
    database: 'manager',
    charset: 'utf8_general_ci'
});
const query = util.promisify(connection.query).bind(connection);
connection.connect(err => {
    if (err) {
        console.log(err.message);
    } else {
        console.log('ket noi thanh cong')
    }
})

async function showList(req, res) {
    let result;
    let sql = 'select * from products';
    try {
        result = await query(sql);
    } catch (err) {
        console.log(err)
    }
    fs.readFile('./views/index.html', 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            let html = ''
            result.forEach(items => {
                html += '<tr>'
                html += `<td>${items.id}</td>`
                html += `<td>${items.name}</td>`
                html += `<td>${items.price}</td>`
                html += `<td><a href="/delete?id=${items.id}">delete</a></td>`
                html += `<td><a href="/update?id=${items.id}">update</a></td>`
                html += '</tr>'
            })
            res.writeHead(200, 'success', {'content-type': 'text/html'})
            data = data.replace('{list-name}', html)
            res.write(data)
            res.end()
        }
    })
}


const server = http.createServer(async (req, res) => {
    let urlPath = url.parse(req.url).pathname;
    switch (urlPath) {
        case '/':
            if (req.method === "GET") {
                await showList(req, res);
            }
            break;
        case '/create':
            if (req.method === "GET") {
                let result;
                let sql = 'select * from products';
                try {
                    result = await query(sql);
                } catch (err) {
                    console.log(err)
                }
                fs.readFile('./views/create.html', 'utf-8', (err, data) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.writeHead(200, 'success', {'content-type': 'text/html'})
                        res.write(data)
                        res.end()
                    }
                })
            } else {
                let data = '';
                req.on('data', chunk => {
                    data += chunk
                })
                req.on('end', async () => {
                    let dataHTML;
                    dataHTML = qs.parse(data);
                    console.log(dataHTML);
                    let sqlCreate = `insert into products (name,price) values ('${dataHTML.name}',${dataHTML.price});`;
                    console.log(sqlCreate)
                    await query(sqlCreate);
                    //quay lai trang index
                    res.writeHead(301, {Location: 'http://localhost:3000/'})
                    return res.end();
                });
                req.on('error', () => {
                    console.log('error')
                })
            }
            break;
        case '/delete':
            let idProduct = url.parse(req.url).query;
            let sqlDelete = `delete from products where ${idProduct}`;
            query(sqlDelete);
            console.log(sqlDelete)
            res.writeHead(301, {Location: 'http://localhost:3000/'})
            res.end()
            break;
        case '/update':
            let idProductUpdate = url.parse(req.url).query;
            if (req.method === 'GET') {
                console.log('avc')
                let html = '';
                let sqlUpdate = `select * from products where ${idProductUpdate};`;
                let result = await query(sqlUpdate);
                console.log(result[0])
                fs.readFile('./views/update.html', 'utf-8', (err, data) => {
                    if (err) {
                        console.log(err.message);
                    } else {
                        html = `<form action="/update?id=${result[0].id}" method="post">
                    id: <input type="text" name="id" value="${result[0].id}" readonly>
                    name: <input type="text" name="name" value="${result[0].name}">
                    price: <input type="text" name="price" value="${result[0].price}">
                    <button type="submit">Tao moi</button>
                    </form>`
                    }
                    data = data.replace('{update-list}', html)
                    res.writeHead(200, {ContentType: 'text/html'})
                    res.write(data)
                    res.end();
                })
            }else{
                let data= '';
                console.log('123')
                req.on('data',chunk => {
                    data+=chunk;
                })
                req.on('end',async ()=>{
                   let dataHtml = await qs.parse(data)
                    console.log(dataHtml)
                    let sql = `update products set name ='${dataHtml.name}', price ='${dataHtml.price}' where id=${dataHtml.id};`;
                    await query(sql)
                    console.log(sql)
                    res.writeHead(301,{Location: 'http://localhost:3000/'})
                    res.end();
                })
            }
    }
});
server.listen(3000, () => {
    console.log('3000')
})