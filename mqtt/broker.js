const aedes = require('aedes');
require('dotenv').config();

const broker = {};

broker.listen = function listen(cb) {
    broker.aedes = aedes();
    broker.server = require('net').createServer(aedes.handle)
    const port = 1883

    broker.server.listen(port, function () {
        console.log('MQTT Broker started and listening on port ', port)
    });

    /*  IF SSL IS REQUIRED, USE BELOW CODE
        const options = {
            key: fs.readFileSync('./certificates/broker-private.pem'),
            cert: fs.readFileSync('./certificates/broker-public.pem'),
        };

        broker.server = tls.createServer(options, broker.aedes.handle);

        log.info(`Starting MQTT broker on port:${config.mqtt.port}`);

    broker.server.listen(config.mqtt.port);
    */

    cb();
};

broker.close = function close(cb) {
    broker.aedes.close(() => {
        console.log("Broker closed");
        cb();
    });
};

broker.setupAuthentication = function setupAuthentication() {
    broker.aedes.authenticate = (client, username, password, cb) => {
        if (username && typeof username === 'string' && username === process.env.mqttUsername) {
            if (password && typeof password === 'object' && password.toString() === process.env.mtqqPassword) {
                cb(null, true);
                console.log(`Client: ${client} authenticated successfully`);
            }
        } else {
            cb(false, false);
        }
    };
};

module.exports = broker;