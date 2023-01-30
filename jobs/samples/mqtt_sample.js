// ===== Replace with your own job name ===== //
const jobName = "mqtt_sample";

const Logger = require('../../helpers/logger');
const logger = new Logger(jobName, 0);

const models = require('../../models/models');
const Model = models.getModel(jobName);

const mongo = require('../../helpers/mongo');
mongo.connectSync();

// ===== Replace with your own MQTT server endpoint and topic ===== //
const endpoint = "mqtt://test.mosquitto.org:1883";
const topicToSubscribe = "hvlb/test";

// Connect to the MQTT server
// See https://github.com/mqttjs/MQTT.js
// and https://github.com/mqttjs/MQTT.js#event-connect
// and https://github.com/mqttjs/MQTT.js#event-disconnect
// and https://github.com/mqttjs/MQTT.js#event-error
// and https://github.com/mqttjs/MQTT.js#event-message
const mqtt = require('mqtt');
const client = mqtt.connect(endpoint);
client.on('connect', onConnect);
client.on('close', onDisconnect);
client.on('error', onError);

function onConnect(connack) {
    logger.log("Connected");

    client.subscribe(topicToSubscribe);
    client.on('message', onMessageReceived);
}

function onDisconnect(packet) {
    logger.log("Disconnected");
    mongo.disconnect();
    client.end();
    process.exit(0);
}

function onError(error) {
    logger.error(error);
    mongo.disconnect();
    client.end();
    process.exit(0);
}

// This is called when we receive a message in the subscribed topic
function onMessageReceived(topic, message, packet) {
    if (topic != topicToSubscribe) return;

    // ===== Replace with your data transform logic below ===== //
    let json = JSON.parse(message.toString());

    let doc = {
        timestamp: new Date(),
        data: json,
    }

    let query = { timestamp: doc.timestamp },
        options = { upsert: true, new: true, setDefaultsOnInsert: true };

    Model.findOneAndUpdate(query, doc, options);
}