const http = require('http')
const qs = require('qs')
const fs = require('fs')
const mysql = require('mysql')
const util = require('util')
const url = require('url')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    port: '3305',
    database: 'manager',
    charset: 'utf8_general_ci'
});

connection.connect(err => {
        if (err) {
            console.log(err);
        } else {
            console.log('connect success')
        }
    }
)
const query = util.promisify(connection.query).bind(connection)
const server = http.createServer(async (req, res) => {
    let urlPath = url.parse(req.url, true).pathname;
    let reqMethod = req.method;
    switch (urlPath) {
        case '/':
            let html = '';
            let sqlShowList = 'select * from products';
            let result = await query(sqlShowList);
            fs.readFile('./views/showlist.html', 'utf-8', (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    result.forEach(item => {
                        html += '<tr>'
                        html += `<td>${item.id}</td>`
                        html += `<td>${item.name}</td>`
                        html += `<td>${item.price}</td>`
                        html += `<td><a href="/delete1?id=${item.id}">delete</a></td>`
                        html += '</tr>'
                    });
                    res.writeHead(200, 'success', {'content-type': 'text/html'});
                    data = data.replace('{show-list}',html)
                    res.write(data);
                    return res.end()
                }
            });
            break;
        case '/create':
            if(reqMethod==='GET'){
                fs.readFile('./views/create.html','utf-8',(err, data) => {
                    if(err){
                        console.log(err);
                    }else{
                        res.writeHead(200,'success',{'content-type':'text/html'});
                        res.write(data);
                        res.end()
                    }
                })
            }else{
                let data = '';
                let dataHTML = ''
                req.on('data',chunk => {
                    data += chunk
                });
                req.on('end',async()=>{
                    dataHTML = qs.parse(data);
                    // console.log(dataHTML);
                    let sqlCreate = `insert into products (name,price) values ('${dataHTML.name}','${dataHTML.price}')`
                    await query(sqlCreate);
                    res.writeHead(301,{location:'http://localhost:3000/'});
                    return res.end()
                });
                req.on('end',err=>{
                    console.log('err');
                })
            }
            break;
        case '/delete1':
            let urlQuery = url.parse(req.url,true).query;
            console.log(urlQuery.id);
            let sqlDelete = `DELETE FROM products where id = ${urlQuery.id}`;
            let a = await query(sqlDelete);
            res.writeHead(301,'success',{Location:'http://localhost:3000/'})
            res.end();
            break;
    }
})

server.listen(3000, () => {
    console.log('server is running')
})