const fs = require('fs');
const datefns = require('date-fns');
const path = require('path');

const levels = [
    "ERROR",
    "WARN ",
    "LOG  ",
];

const intervals = {
    daily: 0,
    weekly: 1,
    monthly: 2,
    yearly: 3,
};

function getIntervalDateFormat(interval) {
    let dtFormat = "";
    if (interval <= intervals.yearly)
        dtFormat += "yyyy";
    if (interval <= intervals.monthly)
        dtFormat += "-MM";
    if (interval == intervals.weekly)
        dtFormat += "-'W'ww";
    if (interval == intervals.daily)
        dtFormat += "-dd";
    return dtFormat;
}

function getLevelString(level) {
    return levels[level];
}

function write(logger, level, message) {
    const scope = logger.scope;
    const interval = logger.interval;
    const onLog = logger.onLog;

    if (!fs.existsSync("logs"))
        fs.mkdirSync("logs");

    let dir = path.join("logs", scope);
    if (!fs.existsSync(dir))
        fs.mkdirSync(dir);

    let dtFormat = getIntervalDateFormat(interval);
    let dtStr = datefns.format(new Date(), dtFormat);
    let filename = path.join(dir, `${dtStr} ${scope}.log`);

    let levelStr = getLevelString(level);
    let timestamp = datefns.format(new Date(), "yyyy-MM-dd HH:mm:ss:SSS");
    message = `${timestamp}    ${levelStr}    ${message}`;

    fs.appendFileSync(filename, message + '\n');

    if (onLog !== undefined && onLog != null)
        onLog(message);

    console.log(`${scope}\t${message}`);
}

class Logger {
    /**
     * Create a logger that automatically creates log files.
     * @param {string} scope The folder which will be created inside `logs/` 
     * where the log files will be generated.
     * @param {int} interval Affects how often to create a new log file and the 
     * date format of the log file name.
     *  * `0`: daily, `"2022-12-31 abc.log"`
     *  * `1`: weekly, `"2022-12-W52 abc.log"`
     *  * `2`: monthly, `"2022-12 abc.log"`
     *  * `3`: yearly, `"2022 abc.log"`
     * @param {Function|undefined} onLog Callback function. Called after 
     * message has been written to file.
     * @returns The logger object with logging functions, one for each logging 
     * level.
     */
    constructor(scope, interval, onLog) {
        this.scope = scope;
        this.interval = interval;
        this.onLog = onLog;
        /**
         * Add a message of ERROR level to the log file.
         * @param {string} msg
         */
        this.error = (msg) => write(this, 0, msg);
        /**
         * Add a message of WARN level to the log file.
         * @param {string} msg
         */
        this.warn = (msg) => write(this, 1, msg);
        /**
         * Add a message of LOG level to the log file.
         * @param {string} msg
         */
        this.log = (msg) => write(this, 2, msg);
    }
};

module.exports = Logger;