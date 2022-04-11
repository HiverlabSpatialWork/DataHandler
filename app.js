'use strict';
const debug = require('debug')('my express app')
const express = require('express')
const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const Graceful = require('@ladjs/graceful');
const Bree = require('bree');
const JobIndex = require('./jobs/index');

const http = require("http");
const Socket = require('ws');

const index = require('./routes/index');
const disaster = require('./routes/disaster');
const mqttRoute = require('./routes/mqtt-sample');

const app = express()

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
app.use("/mqtt", mqttRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found')
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

const aedes = require('aedes')()
const mqttBroker = require('net').createServer(aedes.handle)
const port = 1883

mqttBroker.listen(port, function () {
    console.log('MQTT started and listening on port ', port)
})

const httpServer = http.createServer(app);
const wss = new Socket.WebSocketServer({ server: httpServer });

wss.on('connection', function connection(ws) {
    ws.on('message', function message(data) {
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === Socket.WebSocket.OPEN) {
                client.send(data, { binary: false });
            }
        });
    });
});

httpServer.listen(process.env.PORT || 42423, () => {
    console.log("HTTP Server running on port 42423");
});

const bree = new Bree({
    jobs: JobIndex.jobs,
    workerMessageHandler: message => console.log(message.message)
});

const graceful = new Graceful({ brees: [bree] });
graceful.listen();

bree.start();