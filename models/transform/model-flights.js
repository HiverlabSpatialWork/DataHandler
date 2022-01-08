const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modelName = 'flights';
const schema = new Schema({
    timestamp: { type: Date, default: new Date() },
    data: {
        inbound_flights: [{
            country: String,
            coords: String,
            count: Number,
        }],
        outbound_flights: [{
            country: String,
            coords: String,
            count: Number,
        }],
    },
});

module.exports = mongoose.model(modelName, schema, modelName);