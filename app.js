'use strict';
var debug = require('debug')('my express app');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const Graceful = require('@ladjs/graceful');
const Bree = require('bree');
const JobIndex = require('./jobs/index');

const index = require('./routes/index');
const disaster = require('./routes/disaster');

var app = express();

require('dotenv').config();

process.on('unhandledRejection', (error, promise) => {
    console.log(' Oh Lord! We forgot to handle a promise rejection here: ', promise);
    console.log(' The error was: ', error);
});

process.on('uncaughtException', (error) => {
    console.log('Oh my god, something terrible happened: ', error);
    process.exit(1); // exit application
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/*', index);
app.use("/disaster", disaster);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// todo: fix port not reading from .env?
//app.set('port', process.env.PORT || 42423);
app.set('port', 42423);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});

const bree = new Bree({
    jobs: JobIndex.jobs,
    workerMessageHandler: message => console.log(message.message)
});

const graceful = new Graceful({ brees: [bree] });
graceful.listen();

bree.start();