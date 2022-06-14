const mysql = require('mysql');
const http = require('http');

const connection = mysql.createConnection({
    host:'localhost',
    port:'3305',
    user:'root',
    password:'password',
    database:'quanlybanhang',
    charset:'utf8_general_ci'
});

connection.connect(err=>{
    if(err){
        console.log(err.message);
    }else{
        console.log('connect success')
    }
});

const sql = `select * from customer2`;
connection.query(sql,(err,result,field)=>{
    if(err){
        console.log(err.message);
    }else{
        console.log(result,'select');
    }
});

const sqlWhere = "SELECT * FROM customer2 WHERE address = 'thaibinh'";
connection.query(sqlWhere,(err,result,field)=>{
    if(err){
        console.log(err.message+'abc');
    }else{
        console.log(result ,'where thaibinh');
    }
});

const sqlLimit = "select * from customer2 limit 3";
connection.query(sqlLimit,(err,result,field)=>{
    if(err){
        console.log(err.message);
    }else{
        console.log('limit',result);
    }
})
