const { Schema, model } = require('mongoose');

// Replace with your job name. Must be same as in your job script
const modelName = 'mqtt_sample';

// Replace with your Schema.
// See https://mongoosejs.com/docs/guide.html#definition
const schema = new Schema({
    timestamp: Date,
    data: {},
}, { _id: false });

module.exports = model(modelName, schema, modelName);