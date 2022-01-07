const { parentPort } = require("worker_threads");
function print(message) { if (parentPort != null) parentPort.postMessage(message); }

const DatabaseHelper = require('../../helper/DatabaseHelper');
const ModelHelper = require('../../helper/ModelHelper');
const _ = require('underscore');
const datefns = require('date-fns');

let jobName = 'outbound_orders';
const Model = ModelHelper.models[jobName];
const fetchOrdersData = ModelHelper.models['fetchOrdersData'];
const fetchOrderDetailData = ModelHelper.models['fetchOrderDetailData'];
const fetchPickDetailData = ModelHelper.models['fetchPickDetailData'];
const fetchSKUMaster = ModelHelper.models['fetchSKUMaster'];

let isCancelled = false;
if (parentPort) {
    parentPort.once("message", (message) => {
        if (message === "cancel") isCancelled = true;
    });
}

(async () => {
    try {
        var startTime = new Date();
        print(`[${jobName}] Starting transform on ${startTime.toISOString()}`);

        //Initiate database connection and define model that we need to use
        await DatabaseHelper.connect();

        var orders = await fetchOrdersData.find()
            .where('REQUESTEDSHIPDATE').gte(datefns.startOfDay(startTime));
        var orderDetails = await fetchOrderDetailData.find();
        var pickDetails = await fetchPickDetailData.find();
        var skuMaster = await fetchSKUMaster.find();

        print(`[${jobName}] MongoDB find(): ${datefns.differenceInSeconds(new Date(), startTime)} seconds`);

        var dataArray = _.chain(orders)
            .map(o => {
                if (o.ORDERKEY == null || o.STATUS == null || o.STATUS == '99')
                    return;

                // fetchOrdersData INNER JOIN fetchOrderDetailData ON ORDERKEY
                var od = _.findWhere(orderDetails, { ORDERKEY: o.ORDERKEY });
                if (od == null || od.ORIGINALQTY == 0)
                    return null;

                return {
                    ORDERKEY: o.ORDERKEY,
                    ORDERDATE: o.ADDDATE,
                    STATUS: o.STATUS,
                    ORDERGROUP: o.ORDERGROUP,
                    SUSR1: o.SUSR1,
                    SUSR2: o.SUSR2,
                    REQUESTEDSHIPDATE: o.REQUESTEDSHIPDATE,
                    HAWB: o.HAWB,
                    C_COUNTRY: o.C_COUNTRY,
                    ORDERLINENUMBER: od.ORDERLINENUMBER,
                    SKU: od.SKU,
                    ORIGINALQTY: od.ORIGINALQTY,
                    STORERKEY: od.STORERKEY,
                }
            })
            .map(o => {
                if (o == null) return null;

                // then INNER JOIN pickDefetchPickDetailDatatails on ORDERKEY, ORDERLINENUMBER, SKU
                var pick = _.findWhere(pickDetails, {
                    ORDERKEY: o.ORDERKEY,
                    ORDERLINENUMBER: o.ORDERLINENUMBER,
                    SKU: o.SKU
                });
                if (pick == null || pick.PALLETNUMBER == null)
                    return null;

                o.PALLETNUMBER = pick.PALLETNUMBER;
                return o;
            })
            .map(o => {
                if (o == null) return null;

                // then INNER JOIN fetchSKUMaster on SKU, STORERKEY
                var sku = _.findWhere(skuMaster, {
                    SKU: o.SKU,
                    STORERKEY: o.STORERKEY
                });
                if (sku == null)
                    return null;

                o.STDCUBE = sku.ITEMCUBE;
                return o;
            })
            .compact()
            .value();

        for (var data of dataArray) {
            var query = { ORDERKEY: data.ORDERKEY },
                update = data,
                options = { upsert: true, new: true, setDefaultsOnInsert: true };

            await Model.findOneAndUpdate(query, update, options);
        }

        //Finish your code above
        print(`[${jobName}] Transform completed in ${(Date.now() - startTime) / 1000.0} seconds`);
    } catch (e) {
        print(`[${jobName}] ${e}`);
    } finally {
        //Close database connection
        DatabaseHelper.disconnect();
        process.exit(0);
    }
})();