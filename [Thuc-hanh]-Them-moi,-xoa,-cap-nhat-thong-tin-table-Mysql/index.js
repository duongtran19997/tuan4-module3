const mysql = require('mysql');
const http = require('http');

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'password',
    port:'3305',
    database:'quanlybanhang',
    charset :'utf8_general_ci'
});
connection.connect(err=>{
    if(err){
        console.log(err.message);
    }else{
        console.log('connect success')
    }
});

const sqlCreateTable = "CREATE TABLE IF NOT EXISTS products (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), price INT)";
connection.query(sqlCreateTable,(err)=>{
    if(err){
        console.log(err.message);
    }else{
        console.log('create table success');
    }
});

const sqlDropTable = "DROP TABLE IF EXISTS products";
connection.query(sqlDropTable,(err)=>{
    if(err){
        console.log(err.message);
    }else{
        console.log('drop table success')
    }
});

const sqlAddCols = "ALTER TABLE customer2 ADD COLUMN age int not null default 30";
connection.query(sqlAddCols,err=>{
    if(err){
        console.log(err.message);
    }else{
        console.log('add cols success')
    }
});