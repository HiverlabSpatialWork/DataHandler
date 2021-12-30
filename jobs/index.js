const path = require('path');

const jobs = [];
jobs.push({
    name: path.join('fetch', 'fetchBMSEnergy_Q1'),
    cron: '0 * * * *', // on start and on minute 0 of every hour
    timeout: jobs.length * 10000
});
jobs.push({
    name: path.join('fetch', 'fetchBMSEnergy_Q2'),
    cron: '0 * * * *', // on start and on minute 0 of every hour
    timeout: jobs.length * 10000
});
jobs.push({
    name: path.join('transform', 'bms_energy'),
    cron: '1 * * * *', // on start and on minute 1 of every hour
    timeout: jobs.length * 10000
});

module.exports = {
    jobs
}