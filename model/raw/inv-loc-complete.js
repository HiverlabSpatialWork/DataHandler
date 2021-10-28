const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const invLocCompleteSchema = new Schema({
    CrDate: {
        type: String
    },
    HAWB: {
        type: String
    },
    LocID: {
        type: String
    },
    ModDate: {
        type: String
    },
    PCS: {
        type: String
    },
    STTNo: {
        type: String
    },
    Shipper: {
        type: String
    },
    Status: {
        type: String
    },
    WIN: {
        type: String
    },
    WOU: {
        type: String
    },
    Warehouse: {
        type: String
    },
    Weight: {
        type: String
    }
})

module.exports = mongoose.model('inv-loc-complete', invLocCompleteSchema)