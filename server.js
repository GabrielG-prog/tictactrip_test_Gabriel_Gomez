let express = require('express')
let app = express()
let session = require('express-session')
let Message = require('./models/message')
const nodemailer = require('nodemailer')
const dotenv = require("dotenv");
dotenv.config();

// Moteur de template
app.set('view engine', 'ejs')

// Créer et initialiser l'objet de transport d'email
const transporter = nodemailer.createTransport({
    "host": "smtp.mailtrap.io",
    "port": 2525,
    "secure": false,
    "auth": {
        "user": process.env.EMAIL_USERNAME,
        "pass": process.env.EMAIL_PASSWORD
    }
});

// Middleware
app.use('/assets', express.static('public'))
app.use(express.urlencoded({
    extended: false
}))
app.use(express.json())
app.use(session({
    secret: 'aaa',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false
    }
}))

app.use(require('./middlewares/flash'))

// Routes
app.get('/', (request, response) => {
    response.render('pages/index')
})

app.post('/', (request, response) => {
    if (request.body.email === undefined || request.body.email === "" || request.body.subject === undefined || request.body.subject === "" || request.body.content === undefined || request.body.content === "") {
        request.flash('error', "Please complete all fields")
        response.redirect('/')
    } else {
        Message.create(request.body.email, request.body.subject, request.body.content, function () {

            const emailData = {
                to: request.body.email,
                from: '870877e64b-5875ce@inbox.mailtrap.io',
                subject: request.body.subject,
                text: request.body.content
            }

            transporter.sendMail(emailData, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    request.flash('success', "Message sent")
                    response.redirect('/')
                }
            });
        })
    }

})

app.listen(80)