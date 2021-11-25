const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const invFlightSchedule = new Schema({
    CL_Code: { type: String },
    CMDMTM: { type: String },
    CrDate: { type: String },
    CrUser: { type: String },
    Dest_Port: { type: String },
    Flight_ETD: { type: String },
    Flight_No: { type: String },
    LAT: { type: String },
    MAWB: { type: String },
    MAWB_new: { type: String },
    ModDate: { type: String },
    ModUser: { type: String },
    Ops_AssignedBy: { type: String },
    Ops_AssignedDt: { type: String },
    Ops_AssignedTo: { type: String },
    Ops_ClosedBy: { type: String },
    Ops_ClosedDt: { type: String },
    Ops_Urgent: { type: String }
})

module.exports = mongoose.model('inv-flight-schedule', invFlightSchedule)