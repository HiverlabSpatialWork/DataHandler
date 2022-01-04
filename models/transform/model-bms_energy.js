const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modelName = 'bms_energy';
const schema = new Schema({
    timestamp: { type: Date, default: Date.now },
    data: {
        ts_group_daily: [{
            group_key: String,
            max_min_gap: Number,
            co2_produced: Number,
        }],
        ts_group_weekly: [{
            group_key: String,
            max_min_gap: Number,
            co2_produced: Number,
        }],
        ts_group_monthly: [{
            group_key: String,
            max_min_gap: Number,
            co2_produced: Number,
        }],
        energy_savings: {
            e_monthly_savings: Number,
            converted_savings: Number,
        },
        co2_savings: {
            c_monthly_savings: Number,
            converted_savings: Number,
        }
    }
})

module.exports = mongoose.model(modelName, schema, modelName);