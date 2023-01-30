'use strict';

require('dotenv').config();

const bodyParser = require('body-parser')
const Bree = require('bree');
const cookieParser = require('cookie-parser')
const express = require('express')
const Graceful = require('@ladjs/graceful');
const http = require("http");
const morgan = require('morgan')
const path = require('path')

const index = require('./routes/index');
const jobs = require('./jobs/jobs');
const Logger = require('./helpers/logger');

const logger = new Logger("app", 2);

const app = express()
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// error handlers
process.on('unhandledRejection', (error, promise) => {
    logger.error(`Unhandled promise rejection here: ${promise}`);
    logger.error(`The error was: ${error.stack}`);
});
process.on('uncaughtException', (error) => {
    logger.error(`Uncaught exception: ${error}`);
    logger.error(`\tat ${error.stack}`)
    process.exit(1); // exit application
})

app.use('/*', index);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    logger.error(err.message);
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
        logger.error(err.message);
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
    logger.error(err.message);
});

const httpServer = http.createServer(app);
const port = process.env.NODE_LOCAL_PORT ?? 42423
httpServer.listen(port, () => {
    logger.log(`HTTP Server running on port ${port}`);
});

const bree = new Bree({ jobs: jobs });

const graceful = new Graceful({ brees: [bree] });
graceful.listen();

bree.start();