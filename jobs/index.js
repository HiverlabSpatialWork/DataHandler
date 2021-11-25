const path = require('path');

const jobs = [
    {
        name: path.join('fetch', 'loading-plan'),
        interval: '5m',
        timeout: 0
    },
    {
        name: path.join('fetch', 'inv-loc-complete'),
        interval: '5m',
        timeout: 0
    },
    {
        name: path.join('fetch', 'flight-schedule'),
        interval: '5m',
        timeout: 0
    }
]

module.exports = {
    jobs
}