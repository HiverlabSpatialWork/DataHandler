const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modelName = 'outbound_orders';
const schema = new Schema({
    ORDERKEY: { type: String, index: true },
    ORDERDATE: Date,
    ORDERGROUP: String,
    STATUS: String,
    SUSR1: String,
    SUSR2: String,
    REQUESTEDSHIPDATE: Date,
    HAWB: String,
    C_COUNTRY: String,
    STDCUBE: String,
    TOTALQTY: String,
    ORDERDETAILS: [{
        ITEMCUBE: Number,
        ORDERKEY: String,
        ORDERLINENUMBER: String,
        ORIGINALQTY: Number,
        SKU: String,
        STORERKEY: String,
    }],
})

module.exports = mongoose.model(modelName, schema, modelName);