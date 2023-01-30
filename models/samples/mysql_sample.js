const { Schema, model } = require('mongoose');

// Replace with your job name. Must be same as in your job script
const modelName = 'mysql_sample';

// Replace with your Schema.
// See https://mongoosejs.com/docs/guide.html#definition
const schema = new Schema({
    id: Number,
    value: Number,
}, { _id: false });

module.exports = model(modelName, schema, modelName);