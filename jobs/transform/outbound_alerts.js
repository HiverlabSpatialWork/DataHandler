const { parentPort } = require("worker_threads");
function print(message) { if (parentPort != null) parentPort.postMessage(message); }

const DatabaseHelper = require('../../helper/DatabaseHelper');
const ModelHelper = require('../../helper/ModelHelper');
const _ = require('underscore');
const datefns = require('date-fns');

let jobName = 'outbound_alerts';
const Model = ModelHelper.models[jobName];
const outbound_orders = ModelHelper.models['outbound_orders'];

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
            timestamp: Date.now(),
            data_count: 0,
            data: {
                today: {
                    total_volume: 0,
                    entries_count: 0,
                    entries: []
                },
                sevenDays: {
                    total_volume: 0,
                    entries_count: 0,
                    entries: []
                }
            }
        };

        var now = Date.now();
        var startOfToday = datefns.subHours(datefns.startOfDay(now), 8);
        var endOfToday = datefns.addHours(startOfToday, 24);
        var endOfNextWeek = datefns.addDays(endOfToday, 7);

        var ordersToday = await outbound_orders.find()
            .where('REQUESTEDSHIPDATE').gt(startOfToday).lt(endOfToday)
            .sort({ REQUESTEDSHIPDATE: 1, ORDERDATE: 1 });
        var ordersWeek = await outbound_orders.find()
            .where('REQUESTEDSHIPDATE').gt(startOfToday).lt(endOfNextWeek)
            .sort({ REQUESTEDSHIPDATE: 1, ORDERDATE: 1 });

        doc.data.today.total_volume = _.reduce(ordersToday, (memo, o) => memo += parseFloat(o.STDCUBE), 0);
        doc.data.today.entries_count = ordersToday.length;
        doc.data.today.entries = ordersToday;

        doc.data.sevenDays.total_volume = _.reduce(ordersWeek, (memo, o) => memo += parseFloat(o.STDCUBE), 0);
        doc.data.sevenDays.entries_count = ordersWeek.length;
        doc.data.sevenDays.entries = ordersWeek;

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