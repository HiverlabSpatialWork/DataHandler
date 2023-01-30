// ===== Replace with your own job name ===== //
const jobName = "mysql_sample";

const Logger = require('../../helpers/logger');
const logger = new Logger(jobName, 0);

const models = require('../../models/models');
const Model = models.getModel(jobName);

let startTime = new Date();
logger.log(`Starting job`);

const mongo = require('../../helpers/mongo');
mongo.connectSync();

const mysql = require('mysql');

// ===== Replace with your own MySQL connection details ===== //
const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'user1',
    password: 'password1',
    database: 'db1',
});

// Connect to the MySQL database
// See https://github.com/mysqljs/mysql#establishing-connections
// and https://github.com/mysqljs/mysql#connection-options
db.connect();

// Excute a SQL query
// See https://github.com/mysqljs/mysql#performing-queries
db.query('SELECT * FROM table1', onQuery);

// For keeping track of updates queries into mongo
let updates = [];

// This is called when we get the data from MySQL
function onQuery(error, results, fields) {
    if (error) {
        logger.error(error);
        return;
    }

    logger.log(`Fetched ${results.length} rows`);

    // ===== Replace with your data transform logic below ===== //
    for (let row of results) {
        let doc = {
            id: row.id,
            value: row.value,
        };

        let query = { id: doc.id },
            options = { upsert: true, new: true, setDefaultsOnInsert: true };

        updates[row.id] = false;

        // find and update document in MongoDB
        Model.findOneAndUpdate(query, doc, options)
            .catch(e => logger.error(e.stack ?? `${e}`))
            .then(() => tryEndJob(row.id));
    }
}

// End this job when all mongo update queries are complete
function tryEndJob(updatesIndex) {
    updates[updatesIndex] = true;

    if (updates.some(u => u == false))
        return;

    const jobTime = (Date.now() - startTime) / 1000.0;
    logger.log(`Job complete in ${jobTime} seconds.`);
    db.destroy();
    mongo.disconnect();
    process.exit(0);
}