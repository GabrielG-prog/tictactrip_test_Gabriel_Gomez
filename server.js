const connection = require('./config/db')
const express = require('express')
const verifyToken = require('./config/verifyToken')
const jwt = require('jsonwebtoken')
require("dotenv").config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use(express.text())

// Envoie de l'email et génération de JWT
app.post('/api/token', (req, res) => {
    let email = req.body.email;

    jwt.sign({
        email
    }, process.env.ACCESS_TOKEN_SECRET, (err, token) => {
        connection.query("INSERT INTO user (email) VALUES (?)", email, (err) => {

            if (err) {
                res.status(500).json({
                    'error': 'erreur'
                })
                console.log(err)
            } else {
                res.json({
                    token,
                    email
                });
            }
        })


    })

})

// Vérification de l'authentification du JWT 
app.post('/api/posts', verifyToken, (req, res) => {

    jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET, (err, authData) => {
        if (err) {
            res.sendStatus(403)
            console.log(err)
        } else {
            res.json({
                authData
            })
        }
    })
})

// Insertion du text dans la base de donnée
app.post('/api/justify', (req, res) => {
    let justify = req.body

    let compteur = 0
    let nbIndex = []

    while (compteur < justify.length) {
        compteur += 80
        if (compteur < justify.length) {
            nbIndex.push(compteur)
        }
    }

    let textJustify = [];

    nbIndex.forEach(function (element) {
        textJustify.push(justify.slice(element - 80, element))
    });
    textJustify.push(justify.slice(nbIndex[nbIndex.length - 1], justify.length))

    res.send(textJustify.join("\n"))

    connection.query("INSERT INTO text (length_text) VALUES (?)", justify.length, (err, rows, fields) => {
        if (!err)
            console.log('text envoyé')
        else
            console.log(err)
    });


});

app.listen(process.env.PORT, function () {
    console.log("serveur démarré");
})