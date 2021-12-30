const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    seq: { type: Number },
    ts: { type: Date },
    value: { type: Number }
});
module.exports = mongoose.model('fetchBMSEnergy_Q2', schema, 'fetchBMSEnergy_Q2');