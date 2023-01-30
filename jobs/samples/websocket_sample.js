// ===== Replace with your own job name ===== //
const jobName = "websocket_sample";

const Logger = require('../../helpers/logger');
const logger = new Logger(jobName, 0);

const models = require('../../models/models');
const Model = models.getModel(jobName);

const mongo = require('../../helpers/mongo');
mongo.connectSync();

// ===== Replace with your own WebSocket server endpoint ===== //
const endpoint = "ws://localhost:54321";

// Establish the WebSocket connection and set up event handles
// For more information, 
// see https://github.com/websockets/ws/blob/master/doc/ws.md
const WebSocket = require('ws');
const ws = new WebSocket(endpoint);
ws.on('open', onConnectionOpen);
ws.on('close', onConnectionClose);
ws.on('error', onWebSocketError);
ws.on('message', onMessageReceived);

function onConnectionOpen() {
    logger.log("Connected");
}

function onConnectionClose(code, reason) {
    logger.log(`Disconnected ${code}: ${reason}`);
    mongo.disconnect();
    process.exit(0);
}

function onWebSocketError(error) {
    logger.error(error);
    mongo.disconnect();
    process.exit(0);
}

function onMessageReceived(data, isBinary) {
    // ===== Replace with your data transform logic below ===== //
    let json = JSON.parse(data.toString());

    let doc = {
        timestamp: new Date(),
        data: json,
    }

    let query = { timestamp: doc.timestamp },
        options = { upsert: true, new: true, setDefaultsOnInsert: true };

    Model.findOneAndUpdate(query, doc, options);
}