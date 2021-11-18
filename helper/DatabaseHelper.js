const mongoose = require("mongoose");
const Config = require("../helper/config");

const dbUri = 'mongodb://localhost:27017/data-handler';

async function connect() {
    await mongoose.connect(config.url);
}

async function disconnect() {
    await mongoose.disconnect();
}

module.exports = {
    connect,
    disconnect
}
