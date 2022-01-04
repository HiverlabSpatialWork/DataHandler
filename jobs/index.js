const path = require('path');

const jobs = [];
//jobs.push({
//    name: path.join('fetch', 'fetchBMSEnergy_Q1'),
//    cron: '0 * * * *', // on start and then on minute 0 of every hour
//    timeout: jobs.length * 10000
//});
//jobs.push({
//    name: path.join('fetch', 'fetchBMSEnergy_Q2'),
//    cron: '0 * * * *', // on start and then on minute 0 of every hour
//    timeout: jobs.length * 10000
//});
//jobs.push({
//    name: path.join('transform', 'bms_energy'),
//    cron: '1 * * * *', // on start and then on minute 1 of every hour
//    timeout: jobs.length * 10000
//});
//jobs.push({
//    name: path.join('fetch', 'weather'),
//    interval: '5m', // every 5 minutes
//    timeout: jobs.length * 10000
//});
//jobs.push({
//    name: path.join('fetch', 'fetchOrdersData'),
//    interval: '10m', // every 5 minutes
//    //timeout: jobs.length * 10000
//    timeout: 0
//});
//jobs.push({
//    name: path.join('fetch', 'fetchSKUMaster'),
//    interval: '10m', // every 5 minutes
//    //timeout: jobs.length * 10000
//    timeout: 0
//});
//jobs.push({
//    name: path.join('fetch', 'fetchOrderDetailData'),
//    interval: '10m', // every 5 minutes
//    //timeout: jobs.length * 10000
//    timeout: 0
//});
//timeout: 0
//jobs.push({
//    name: path.join('fetch', 'fetchPickDetailData'),
//    interval: '10m', // every 5 minutes
//    //timeout: jobs.length * 10000
//    timeout: 0
//});
//jobs.push({
//    name: path.join('fetch', 'fetchAFCLShipments'),
//    interval: '10m', // every 5 minutes
//    //timeout: jobs.length * 10000
//    timeout: 0
//});
//jobs.push({
//    name: path.join('transform', 'outbound_orders'),
//    interval: '5m', // every 5 minutes
//    //timeout: jobs.length * 10000
//    timeout: 0
//});
//jobs.push({
//    name: path.join('transform', 'outbound_alerts'),
//    interval: '5m', // every 5 minutes
//    //timeout: jobs.length * 10000
//    timeout: 0
//});
jobs.push({
    name: path.join('transform', 'inbound_alerts'),
    interval: '5m', // every 5 minutes
    //timeout: jobs.length * 10000
    timeout: 0
});

module.exports = {
    jobs
}