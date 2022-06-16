const mysql = require('mysql');
const http = require('http');
const fs = require('fs');
const qs = require('qs');
const util = require('util');
const url = require('url')

const connection = mysql.createConnection({
    host:'localhost',
    port:'3305',
    user:'root',
    password:'password',
    charset:'utf8_general_ci',
    database:'manager',
});

connection.connect(err=>{
    if(err){
        console.log(err.message);
    }else{
        console.log('connect success')
    }
});

async function showList(req,res){
    let html = '';
    let sql = 'select * from products;';
    let result = await query(sql);
    // console.log(result)
    fs.readFile('./views/index.html','utf-8',(err, data) => {
        if(err){
            console.log(err.message);
        }else{
            result.forEach(value=>{
                html+='<tr>'
                html+=`<td>${value.id}</td>`
                html+=`<td>${value.name}</td>`
                html+=`<td>${value.price}</td>`
                html+=`<td><a href="/delete-item?id=${value.id}">delete</a></td>`
                html+=`<td><a href='/update?id=${value.id}'>update</a></td>`
                html+='</tr>'
            })

            res.writeHead(200,{'content-type':'text/html'})
            data = data.replace('{list-products}',html)
            res.write(data)
            return res.end()
        }
    })
}

const query = util.promisify(connection.query).bind(connection)

const server = http.createServer(async (req, res) => {
    const urlPath = url.parse(req.url,true).pathname;
    // console.log(url.parse(req.url,true));
    switch (urlPath) {
        case '/': await showList(req,res)
            break;
        case '/create' :
            if(req.method ==='GET'){
                fs.readFile('./views/create.html','utf-8',(err, data) => {
                if(err){
                    console.log(err.message);
                }else{
                    res.writeHead(200,'success',{'content-type':'text/html'})
                    res.write(data);
                    return res.end()
                }
                })
            }else{
                let data ='';
                req.on('data',chunk => {
                    data+=chunk
                })
                req.on('end',async()=>{
                    let dataHTML = qs.parse(data);
                    // console.log(dataHTML);
                    let sqlCreate = `insert into products (name,price) values ('${dataHTML.name}','${dataHTML.price}')`
                    let result = await query(sqlCreate);
                    res.writeHead(301,{Location:'http://localhost:3000/'})
                    return res.end()
                })
            }
            break;
        case '/delete-item':
            const urlQuery = url.parse(req.url,true).query.id;
            let sqlDelete = `delete from products where id = ${urlQuery}`
            console.log(sqlDelete);
            await query(sqlDelete);
            res.writeHead(301, {Location: 'http://localhost:3000/'})
            res.end();
            break;
        case '/update':
            const urlUpdate = url.parse(req.url,true).query.id;
            if(req.method==='GET'){
                let sql = `select * from products where id = ${urlUpdate}`
              let result =  await query(sql);
                fs.readFile('./views/update.html', 'utf8', ((err, data) => {
                    if (err) {
                        throw new Error(err.message)
                    }

                    let html = '';
                    html = `<form action="/update?id=${result[0].id}" method="post">
                    id: <input type="text" name="id" value="${result[0].id}" readonly>
                    name: <input type="text" name="name" value="${result[0].name}">
                    price: <input type="text" name="price" value="${result[0].price}">
                    <button type="submit">Tao moi</button>
                    </form>`

                    data = data.replace('{update}', html)
                    res.writeHead(200, {ContentType: 'text/html'})
                    res.write(data)
                    res.end();
                }))

            }else{
                let data = '';
                req.on('data',chunk => {
                    data+= chunk
                })
                req.on('end',async()=>{
                    let dataHTML = qs.parse(data);
                    console.log(dataHTML);
                    let sql = `update products set name = '${dataHTML.name}', price = ${dataHTML.price} where id =${dataHTML.id};`;
                    await query(sql);
                    res.writeHead(301, {Location: 'http://localhost:3000/'})
                    res.end();
                })

            }
    }
})

server.listen(3000,()=>{
    console.log('server is running at 3000')
})