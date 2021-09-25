// Vérification du token
function verifyToken(req, res, next) {

    const bearerHeader = req.headers['authorization']
    const bearer = bearerHeader.split(" ")[1]
    req.token = bearer

    next()
}

module.exports = verifyToken