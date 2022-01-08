const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modelName = 'outbound_alerts';
const schema = new Schema({
    timestamp: { type: Date, default: new Date() },
    data: {
        today: {
            total_volume: Number,
            entries_count: Number,
            entries: [{
            }],
        },
        sevenDays: {
            total_volume: Number,
            entries_count: Number,
            entries: [{
            }],
        },
    }
})

module.exports = mongoose.model(modelName, schema, modelName);