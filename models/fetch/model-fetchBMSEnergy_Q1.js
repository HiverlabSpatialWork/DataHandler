const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    seq: { type: Number },
    ts: { type: Date },
    value: { type: Number }
});
module.exports = mongoose.model('fetchBMSEnergy_Q1', schema, 'fetchBMSEnergy_Q1');