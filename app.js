const createError = require('http-errors');
const express = require('express');
const expressHbs = require('express-handlebars');

const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const expressValidator = require('express-validator');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const multer = require('multer');
const flash = require('connect-flash');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const db = mongoose.connection;
const HandlebarsHelpers = require("./helpers/handlebar.js");
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();
let hbs = expressHbs({
    defaultLayout: 'layout', extname: '.hbs'
});

new HandlebarsHelpers(hbs).registerHelpers();


// view engine setup
app.engine('.hbs',expressHbs);
app.set('view engine', '.hbs');

//handle file uploads
app.use(multer({dest: './uploads'}).single('photo'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Handle Sessions
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// In this example, the formParam value is going to get morphed into form body format useful for printing.
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
