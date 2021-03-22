'use strict';
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var cors = require('cors');
var passport = require('passport');
var MongoClient = require('mongodb').MongoClient;
var nodemailer = require('nodemailer');
global.config = require('./server/config/dbconfig');//access db data


var login = require('./server/api/student.login.js');
var reg = require('./server/api/student.signup.js');
var form = require('./server/api/student.form.js');

var db;
//email credentials
global.transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'bhagatpooja1@gmail.com',
        pass: 'sfuroqbsoupqborf'
    }
});

//connect database
MongoClient.connect(config.mongoDatabase, function (err, coll) {
    if (err) {
        //res.status(500).send("No Internet Connection");
        console.log(err);
    }
    else {
        db = coll.db('virtualGainStudents_db');
        console.log("mongodb database connected");
    }
});
// pass passport for configuration
require('./server/config/passport')(passport);
var app = express();

app.use(bodyParser.json({ limit: "50mb" }));//data upload limit
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(passport.initialize());//invoked on every request. It ensures the session contains a passport.user object, which may be empty.
app.use(passport.session()); // persistent login sessions. is a Passport Strategy which will load the user object onto req.user if a serialised user object was found in the server.

//Make our db accessible to our router
app.use(function (req, res, next) {
    req.db = db;
    next();
});

app.use(cors());
//cors 
// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
//     next();
// });
app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, x-access-token');
   //  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,x-access-token");
    //"Access-Control-Allow-Headers", "Content-Type, accessToken, signedInUserId, x-requested-with"
    res.setHeader('Access-Control-Allow-Credentials', true);
    if (req.method === 'OPTIONS') {
        console.log('OPTIONS SUCCESS');
        res.end();
    }
    else {
        next();
    }
});



// prepare server routing
app.use('/', express.static(__dirname + '/public')); // redirect static calls

app.use(cookieParser());
app.set('trust proxy', 1);
app.use(session({
    secret: 'virtualgaintech',
    cookie: {
        httpOnly: true,
        secure: (process.env.NODE_ENV === 'production'),
        maxAge: 1000 * 60 * 60 // 1 hours to expire the session and avoid memory leak
    },
    resave: false,
    saveUninitialized: true
}));


app.use('/api/signin', login); 
app.use('/api/reg', reg); 
app.use(require('./server/config/token'));
app.use('/api/form', form);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

process.on('uncaughtException', function (err) {
    console.log(err);
});
app.listen(2021);
module.exports = app;