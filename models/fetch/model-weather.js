const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modelName = 'weather';
const schema = new Schema({
    timestamp: { type: Date, default: Date.now },
    cities: {
        name: String,
        coord: String,
        current: {
            temp: Number,
            weather: {
                id: Number,
                main: String,
                description: String,
                icon: String,
            },
        },
        hourly: [{
            dt: Date,
            temp: Number,
            weather: {
                id: Number,
                main: String,
                description: String,
                icon: String,
            },
        }],
        daily: [{
            dt: Date,
            tempMin: Number,
            weather: {
                id: Number,
                main: String,
                description: String,
                icon: String,
            },
        }],
    },
});

module.exports = mongoose.model(modelName, schema, modelName);