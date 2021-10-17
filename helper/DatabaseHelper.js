const mongoose = require("mongoose");

const dbUri = 'mongodb://localhost:27017/data-handler';

async function connect() {
    await mongoose.connect(dbUri);
}

async function disconnect() {
    await mongoose.disconnect();
}

module.exports = {
    connect,
    disconnect
}
