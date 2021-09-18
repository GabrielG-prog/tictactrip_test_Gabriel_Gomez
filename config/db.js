var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'email_data',
    port: '8889'
});

connection.connect() 

module.exports = connection