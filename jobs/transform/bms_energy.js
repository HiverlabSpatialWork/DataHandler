const { parentPort } = require("worker_threads");
function print(message) { if (parentPort != null) parentPort.postMessage(message); }

const DatabaseHelper = require('../../helper/DatabaseHelper');
const ModelHelper = require('../../helper/ModelHelper');
const _ = require('underscore');
const datefns = require('date-fns');

let jobName = 'bms_energy';
const Model = ModelHelper.models[jobName];
const fetchBMSEnergy_Q1 = ModelHelper.models['fetchBMSEnergy_Q1'];
const fetchBMSEnergy_Q2 = ModelHelper.models['fetchBMSEnergy_Q2'];

let isCancelled = false;
if (parentPort) {
    parentPort.once("message", (message) => {
        if (message === "cancel") isCancelled = true;
    });
}

(async () => {
    try {
        var startTime = Date.now();

        //Initiate database connection and define model that we need to use
        await DatabaseHelper.connect();

        //Start writing your code below
        var doc = {
            timestamp: new Date(),
            data: {
                ts_group_daily: [],
                ts_group_weekly: [],
                ts_group_monthly: [],
                energy_savings: {
                    e_monthly_savings: 0,
                    converted_savings: 0
                },
                co2_savings: {
                    c_monthly_savings: 0,
                    converted_savings: 0
                }
            }
        };

        var today = datefns.startOfDay(new Date());
        var firstDayOf3MonthsAgo = datefns.startOfMonth(datefns.subMonths(today, 3));

        var q1Data = await fetchBMSEnergy_Q1
            .find({ ts: { $gte: firstDayOf3MonthsAgo, } })
            .sort({ ts: -1 })
            .select('ts value');
        var q2Data = await fetchBMSEnergy_Q2
            .find({ ts: { $gte: firstDayOf3MonthsAgo, } })
            .sort({ ts: -1 })
            .select('ts value');

        for (var i = 6; i >= 0; --i) {
            // get last 7 days' values
            var date = datefns.subDays(today, i);
            var deltaByDate =
                getValueDeltaByDate(q1Data, date) +
                getValueDeltaByDate(q2Data, date);
            doc.data.ts_group_daily.push({
                group_key: datefns.formatISO9075(date, { representation: 'date' }),
                max_min_gap: deltaByDate,
                co2_produced: deltaByDate * 0.4085
            });

            // get last 7 weeks' values
            var week = datefns.subWeeks(today, i);
            var deltaByWeek =
                getValueDeltaByWeek(q1Data, week) +
                getValueDeltaByWeek(q2Data, week);
            if (deltaByWeek > 0) {
                doc.data.ts_group_weekly.push({
                    group_key: datefns.format(week, "yyyy-'W'II"),
                    max_min_gap: deltaByWeek,
                    co2_produced: deltaByWeek * 0.4085
                });
            }

            // (try to) get last 7 months' values
            var month = datefns.subMonths(today, i);
            var deltaByMonth =
                getValueDeltaByMonth(q1Data, month) +
                getValueDeltaByMonth(q2Data, month);
            if (deltaByMonth > 0) {
                doc.data.ts_group_monthly.push({
                    group_key: datefns.format(month, 'yyyy-MMM'),
                    max_min_gap: deltaByMonth,
                    co2_produced: deltaByMonth * 0.4085
                });
            }
        }

        // monthly savings is taken from last month
        doc.data.energy_savings.e_monthly_savings = 414436 -
            _.last(doc.data.ts_group_monthly, 2)[0].max_min_gap;
        doc.data.energy_savings.converted_savings =
            Math.round(doc.data.energy_savings.e_monthly_savings / 358);
        doc.data.co2_savings.c_monthly_savings =
            doc.data.energy_savings.e_monthly_savings * 0.4085;
        doc.data.co2_savings.converted_savings =
            Math.round(doc.data.co2_savings.c_monthly_savings / 380);

        //print(doc);

        var query = { timestamp: doc.timestamp },
            update = doc,
            options = { upsert: true, new: true, setDefaultsOnInsert: true };

        await Model.findOneAndUpdate(query, update, options);

        //Finish your code above
        print(`[${jobName}] Fetch completed in ${(Date.now() - startTime) / 1000.0} seconds`);
    } catch (e) {
        print(`[${jobName}] ${e}`);
    } finally {
        //Close database connection
        DatabaseHelper.disconnect();
        process.exit(0);
    }
})();

function getValueDeltaByDate(data, date) {
    return getValueDelta(data, date, datefns.startOfDay, datefns.endOfDay);
}

function getValueDeltaByWeek(data, anyDayInWeek) {
    return getValueDelta(data, anyDayInWeek, datefns.startOfISOWeek, datefns.endOfISOWeek);
}

function getValueDeltaByMonth(data, anyDayInMonth) {
    return getValueDelta(data, anyDayInMonth, datefns.startOfMonth, datefns.endOfMonth);
}

function getValueDelta(data, date, startDateFunc, endDateFunc) {
    var dataArray = _.chain(data)
        .filter(d => startDateFunc(date) < d.ts && d.ts < endDateFunc(date))
        .sortBy(d => d.ts)
        .value();
    if (dataArray.length == 0) return null;
    var firstValue = _.first(dataArray).value;
    var lastValue = _.last(dataArray).value;
    return lastValue - firstValue;
}