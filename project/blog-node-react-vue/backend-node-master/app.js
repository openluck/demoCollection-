var createError = require('http-errors');
var express = require('express');
require('express-async-errors')
var path = require('path');
var cookieParser = require('cookie-parser');
var history = require('connect-history-api-fallback')
var logger = require('morgan');
const verifyParameters = require('./utils/verifyParameters')
var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');

var app = express();
require('./model/connection.js')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', apiRouter);

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//     next(createError(404));
// });
app.use(verifyParameters)
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
