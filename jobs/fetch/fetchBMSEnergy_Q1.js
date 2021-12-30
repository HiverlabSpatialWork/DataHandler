const { parentPort } = require("worker_threads");
const axios = require('axios');
const DatabaseHelper = require('../../helper/DatabaseHelper');
const ModelHelper = require('../../helper/ModelHelper');
const mongoose = require('mongoose');
const epochHelper = require("../../helper/epoch-helper");
const Schema = mongoose.Schema;

let jobName = "fetchBMSEnergy_Q1";
const Model = ModelHelper.models[jobName];

let isCancelled = false;
if (parentPort) {
    parentPort.once("message", (message) => {
        if (message === "cancel") isCancelled = true;
    });
}

(async () => {
    try {
        await DatabaseHelper.connect();

        //Call the API and get its response
        var response = await axios.post('http://10.236.20.23/ccApp/Service1.svc/fetchBMSEnergy_Q1', {
            data: '{["IDENTIFIER":"Hiverlab"]}',
        });

        const dataArray = response.data;

        for (let data of dataArray) {
            data.ts = epochHelper.convertEpoch(data.ts);
            var query = { seq: data.seq },
                update = data,
                options = { upsert: true, new: true, setDefaultsOnInsert: true };

            await Model.findOneAndUpdate(query, update, options);
        }

        console.log(`[${jobName}] Fetch complete on ${Date()}`);
    } catch (e) {
        console.log(`[${jobName}] ${e}`);
    } finally {
        //Close database connection
        DatabaseHelper.disconnect();
        process.exit(0);
    }
})();