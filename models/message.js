let connection = require('../config/db')

class Message {

    static create(email, subject, content, callBack) {
        connection.query('INSERT INTO message SET email = ?, subject = ?, content = ?', [
            email, subject, content
        ], (err, result) => {
            if (err) throw err
            callBack(result)
        })
    }
}

module.exports = Message