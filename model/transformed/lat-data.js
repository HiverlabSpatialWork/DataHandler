const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const loadingPlanSchema = new Schema({
    Type: {
        type: String
    },
    Consignee: {
        type: String
    },
    CrDate: {
        type: String
    },
    HAWB: {
        type: String
    },
    LocID: {
        type: String
    },
    MAWB: {
        type: String
    },
    MAWB_Dest_Port: {
        type: String
    },
    ModDate: {
        type: String
    },
    ModUser: {
        type: String
    },
    Ops_AssignedBy: {
        type: String
    },
    Ops_AssignedDt: {
        type: String
    },
    Ops_AssignedTo: {
        type: String
    },
    Ops_ClosedBy: {
        type: String
    },
    Ops_ClosedDt: {
        type: String
    },
    PCS: {
        type: String
    },
    Permit_Email_Dt: {
        type: String
    },
    Remarks: {
        type: String
    },
    Secured: {
        type: String
    },
    Weight: {
        type: String
    }
})

module.exports = mongoose.model('loading-plan', loadingPlanSchema)