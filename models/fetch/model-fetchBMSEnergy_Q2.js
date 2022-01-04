const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modelName = 'fetchBMSEnergy_Q2';
const schema = new Schema({
    seq: { type: Number, index: true },
    ts: Date,
    value: Number
});

module.exports = mongoose.model(modelName, schema, modelName);