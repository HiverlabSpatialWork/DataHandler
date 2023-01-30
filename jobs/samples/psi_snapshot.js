// ===== Replace with your own job name ===== //
const jobName = "psi_snapshot";

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
        let doc = { timestamp: data.timestamp, data: [] };

        for (let key in data.readings) {
            let reading = data.readings[key];
            doc.data.push({
                reading: key,
                national: reading.national,
                north: reading.north,
                south: reading.south,
                east: reading.east,
                west: reading.west,
                central: reading.central,
            })
        }

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