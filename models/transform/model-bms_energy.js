const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    timestamp: { type: Date },
    data: {
        ts_group_daily: [{
            group_key: { type: String },
            max_min_gap: { type: Number },
            co2_produced: { type: Number },
        }],
        ts_group_weekly: [{
            group_key: { type: String },
            max_min_gap: { type: Number },
            co2_produced: { type: Number },
        }],
        ts_group_monthly: [{
            group_key: { type: String },
            max_min_gap: { type: Number },
            co2_produced: { type: Number },
        }],
        energy_savings: {
            e_monthly_savings: { type: Number },
            converted_savings: { type: Number },
        },
        co2_savings: {
            c_monthly_savings: { type: Number },
            converted_savings: { type: Number },
        }
    }
})
module.exports = mongoose.model('bms_energy', schema, 'bms_energy');;