const { Schema, model } = require('mongoose');

// Replace with your job name. Must be same as in your job script
const modelName = 'psi_snapshot';

// Replace with your Schema.
// See https://mongoosejs.com/docs/guide.html#definition
const schema = new Schema({
    timestamp: Date,
    data: [{
        reading: String,
        national: Number,
        north: Number,
        south: Number,
        east: Number,
        west: Number,
        central: Number,
    }],
}, { _id: false });

module.exports = model(modelName, schema, modelName);