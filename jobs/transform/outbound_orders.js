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

        // nested joining with fetchPickDetailData on ORDERKEY, ORDERLINENUMBER, SKU
        const pickDetailLookup = {
            'from': 'fetchPickDetailData',
            'let': {
                'od_ORDERKEY': '$ORDERKEY',
                'od_ORDERLINENUMBER': '$ORDERLINENUMBER',
                'od_SKU': '$SKU'
            },
            'pipeline': [
                {
                    '$match': {
                        '$expr': {
                            '$and': [
                                { '$eq': ['$ORDERKEY', '$$od_ORDERKEY'] },
                                { '$eq': ['$ORDERLINENUMBER', '$$od_ORDERLINENUMBER'] },
                                { '$eq': ['$SKU', '$$od_SKU'] }
                            ]
                        }
                    }
                },
                {
                    '$project': { 'PALLETNUMBER': 1, '_id': 0 }
                }
            ],
            'as': 'PickDetail'
        };

        // second nested joining with fetchSKUMaster
        const skuLookup = {
            'from': 'fetchSKUMaster',
            'let': {
                'od_SKU': '$SKU',
                'od_STORERKEY': '$STORERKEY'
            },
            'pipeline': [
                {
                    '$match': {
                        '$expr': {
                            '$and': [
                                { '$eq': ['$SKU', '$$od_SKU'] },
                                { '$eq': ['$STORERKEY', '$$od_STORERKEY'] }
                            ]
                        }
                    }
                },
                {
                    '$project': { 'ITEMCUBE': 1, '_id': 0 }
                }
            ],
            'as': 'SKUMaster'
        };

        var orders = await fetchOrdersData.aggregate([
            {
                // select only the fields we need
                '$project': {
                    'ORDERKEY': 1,
                    'ORDERDATE': 1,
                    'STATUS': 1,
                    'ORDERGROUP': 1,
                    'SUSR1': 1,
                    'SUSR2': 1,
                    'REQUESTEDSHIPDATE': 1,
                    'HAWB': 1,
                    'C_COUNTRY': 1
                }
            },
            {
                // filter by REQUESTEDSHIPDATE, ORDERKEY, STATUS
                '$match': {
                    'REQUESTEDSHIPDATE': {
                        '$ne': null,
                        '$gte': datefns.startOfDay(new Date())
                    },
                    'ORDERKEY': { '$ne': null },
                    'STATUS': { '$ne': [null, 99] }
                }
            },
            {
                // joining with fetchOrderDetailData on ORDERKEY
                '$lookup': {
                    'from': 'fetchOrderDetailData',
                    'let': {
                        'o_ORDERKEY': '$ORDERKEY'
                    },
                    'pipeline': [
                        {
                            '$match': {
                                '$expr': {
                                    '$and': [
                                        { '$eq': ['$ORDERKEY', '$$o_ORDERKEY'] }
                                    ]
                                }
                            }
                        },
                        {
                            '$project': {
                                'ORDERKEY': 1,
                                'ORDERLINENUMBER': 1,
                                'SKU': 1,
                                'ORIGINALQTY': 1,
                                'STORERKEY': 1,
                                '_id': 0
                            }
                        },
                        { '$lookup': pickDetailLookup },
                        {
                            '$replaceRoot': {
                                'newRoot': {
                                    '$mergeObjects': [
                                        { '$arrayElemAt': ['$PickDetail', 0] },
                                        '$$ROOT'
                                    ]
                                }
                            }
                        },
                        { '$lookup': skuLookup },
                        {
                            '$replaceRoot': {
                                'newRoot': {
                                    '$mergeObjects': [
                                        { '$arrayElemAt': ['$SKUMaster', 0] },
                                        '$$ROOT'
                                    ]
                                }
                            }
                        },
                        { '$project': { 'PickDetail': 0, 'SKUMaster': 0 } }
                    ],
                    'as': 'ORDERDETAILS'
                }
            },
            {
                '$addFields': {
                    'STDCUBE': {
                        '$reduce': {
                            'input': '$ORDERDETAILS',
                            'initialValue': 0,
                            'in': { '$add': ['$$value', '$$this.ITEMCUBE'] }
                        }
                    },
                    'TOTALQTY': {
                        '$reduce': {
                            'input': '$ORDERDETAILS',
                            'initialValue': 0,
                            'in': { '$add': ['$$value', '$$this.ORIGINALQTY'] }
                        }
                    }
                }
            }
        ]);

        print(`[${jobName}] MongoDB aggregate(): ${datefns.differenceInSeconds(new Date(), startTime)} seconds`);

        for (var order of orders) {
            var query = { ORDERKEY: order.ORDERKEY },
                update = order,
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