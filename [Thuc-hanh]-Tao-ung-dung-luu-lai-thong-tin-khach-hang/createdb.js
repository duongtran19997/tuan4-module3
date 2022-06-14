const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    port:'3305',
    user: 'root',
    password: 'password',
    database: 'quanlybanhang',
    charset: 'utf8_general_ci'
});
connection.connect(err=>{
    if(err){
        console.log(err.message);
    }else{
        console.log('connect success')
        const sql = 'create table customer2 (id INT NOT NULL PRIMARY KEY AUTO_INCREMENT ,name varchar(30) not null, address varchar(30))';
        connection.query(sql,err=>{
            if(err){
                console.log(err.message);
            }else{
                console.log('table success')
                connection.end()
            }
        });
    }
})

