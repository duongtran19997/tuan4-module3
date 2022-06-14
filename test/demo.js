const mysql = require('mysql');


const connection = mysql.createConnection({
    host:'127.0.0.1',
    user:'root',
    password:'password',
    database:'quanlybanhang',
    port: '3305',
    charset :'utf8_general_ci'
})

connection.connect(err=>{
    if(err){
        console.log('erro' + err.message);
    }else
        console.log('connect success')
});
// const sql = 'CREATE TABLE city (id INT NOT NULL PRIMARY KEY AUTO_INCREMENT ,name varchar(30) not null, zipcode varchar(6))';

const sql = "INSERT INTO city(name,zipcode) values ('Ha Noi', '100000'),('T.P HCM','80000'), ('Da Nang', '50000'), ('Nam Dinh', '40000')";
connection.query(sql, function (err) {
    if (err) throw err;
    console.log('Insert data success');
});