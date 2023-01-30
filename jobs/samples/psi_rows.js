// ===== Replace with your own job name ===== //
const jobName = "psi_rows";

const Logger = require('../../helpers/logger');
const logger = new Logger(jobName, 0);

const models = require('../../models/models');
const Model = models.getModel(jobName);

const mongo = require('../../helpers/mongo');

const axios = require('axios');
const https = require('https');
const instance = axios.create({
    httpsAgent: new https.Agent({ rejectUnauthorized: false })
});

// ===== Replace with your own REST API endpoint ===== //
const endpoint = "https://api.data.gov.sg/v1/environment/psi";

(async () => {
    let startTime = new Date();
    logger.log(`Starting job`);
    try {
        await mongo.connect();

        var response = await instance.get(endpoint);

        if (response.status != 200)
            throw `Unable to retrieve data: ${response.error}`;

        // ===== Replace with your data transform logic below ===== //
        const data = response.data.items[0];
        const reading = data.readings.psi_twenty_four_hourly;
        let doc = {
            timestamp: data.timestamp,
            psi_national: reading.national,
            psi_north: reading.north,
            psi_south: reading.south,
            psi_east: reading.east,
            psi_west: reading.west,
            psi_central: reading.central,
        };

        let query = { timestamp: data.timestamp },
            options = { upsert: true, new: true, setDefaultsOnInsert: true };

        await Model.findOneAndUpdate(query, doc, options);
    } catch (e) {
        logger.error(e.stack ?? `${e}`);
    } finally {
        const jobTime = (Date.now() - startTime) / 1000.0;
        logger.log(`Job complete in ${jobTime} seconds.`);
        mongo.disconnect();
        process.exit(0);
    }
})();