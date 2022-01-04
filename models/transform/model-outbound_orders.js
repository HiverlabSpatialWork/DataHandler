const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modelName = 'outbound_orders';
const schema = new Schema({
    ORDERKEY: { type: String, index: true },
    ORDERDATE: Date,
    STATUS: String,
    ORDERGROUP: String,
    SUSR1: String,
    SUSR2: String,
    REQUESTEDSHIPDATE: Date,
    HAWB: String,
    C_COUNTRY: String,
    ORDERLINENUMBER: String,
    SKU: String,
    ORIGINALQTY: String,
    STDCUBE: String,
    PALLETNUMBER: String,
})

module.exports = mongoose.model(modelName, schema, modelName);