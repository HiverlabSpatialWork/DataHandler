const { Schema, model } = require('mongoose');

// Replace with your job name. Must be same as in your job script
const modelName = 'psi_rows';

// Replace with your Schema.
// See https://mongoosejs.com/docs/guide.html#definition
const schema = new Schema({
    timestamp: Date,
    psi_national: Number,
    psi_north: Number,
    psi_south: Number,
    psi_east: Number,
    psi_west: Number,
    psi_central: Number,
}, { _id: false });

module.exports = model(modelName, schema, modelName);