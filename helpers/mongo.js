const mongoose = require("mongoose");
const config = require("./config");

const options = {
    maxPoolSize: 1,
    socketTimeoutMS: 60000,
};

function isConnected() {
    return mongoose.connection.readyState
};

async function connect(onConnect, onFail) {
    if (isConnected()) return;

    mongoose.set("strictQuery", false);
    await mongoose.connect(config.mongo_url, options)
        .then(() => onConnect ? onConnect() : () => { })
        .catch(err => onFail ? onFail(err) : () => { });
}

function connectSync(onConnect, onFail) {
    if (isConnected()) return;

    mongoose.set("strictQuery", false);
    mongoose.connect(config.mongo_url, options)
        .then(() => onConnect ? onConnect() : () => { })
        .catch(err => onFail ? onFail(err) : () => { });
}

function disconnect(onDisconnect) {
    if (!isConnected) return;

    mongoose.disconnect()
        .then(() => onDisconnect ? onDisconnect() : () => { });
}

mongoose.plugin((schema) => {
    schema.options.toJSON = {
        virtuals: true,
        versionKey: false,
        transform(doc, ret) {
            delete ret._id
            delete ret.id;
            delete ret.__v;
        }
    };
})

module.exports = {
    connect,
    connectSync,
    disconnect,
    isConnected,
}