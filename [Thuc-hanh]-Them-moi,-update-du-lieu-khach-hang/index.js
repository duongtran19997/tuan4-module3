const mysql = require('mysql');
const http = require('http');

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'password',
    port:'3305',
    charset:'utf8_general_ci',
    database:'quanlybanhang'
});

connection.connect(err=>{
    if(err){
        console.log(err.message);
    }else{
        console.log('connect success')
    }
});

const sqlInsert = "insert into customer2 (id,name,address) values (7,'emma watson','london')";
connection.query(sqlInsert,(err,result,field)=>{
    if(err){
        console.log(err.message);
    }else{
        console.log('1 record inserted')
    }
})

const sqlUpdate = "update customer2 set name = 'batman',address = 'gotham' where id = 3 ";
connection.query(sqlUpdate,(err,result)=>{
    if(err){
        console.log(err.message);
    }else{
        console.log('1 record has update')
    }
});