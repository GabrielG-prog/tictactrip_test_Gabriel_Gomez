const mysql = require('mysql');

// Connexion de la base de donnée
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'test_data',
    port: '8889'
});

connection.connect(function (err) {
    if (!err) {
        console.log('Successful connection !')

    } else {
        console.log('DB FAILED ERROR : ' + JSON.stringify(err, undefined, 2))

    }
});

module.exports = connection