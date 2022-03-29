const { parentPort } = require("worker_threads");
function print(message) { if (parentPort != null) parentPort.postMessage(message); }

const axios = require('axios');
const DatabaseHelper = require('../../helper/DatabaseHelper');
const epochHelper = require("../../helper/epoch-helper");

let jobName = "fetchBMSEnergy_Q2";
const Model = require(`model-${jobName}`);

let isCancelled = false;
if (parentPort) {
    parentPort.once("message", (message) => {
        if (message === "cancel") isCancelled = true;
    });
}

(async () => {
    try {
        var startTime = new Date();
        print(`[${jobName}] Starting fetch on ${startTime.toISOString()}`);

        await DatabaseHelper.connect();

        //Call the API and get its response
        var response = await axios.post('http://10.236.20.23/ccApp/Service1.svc/fetchBMSEnergy_Q2', {
            data: '{["IDENTIFIER":"Hiverlab"]}',
        });

        const dataArray = response.data;

        if (dataArray.length == 0)
            throw "Empty data from API";
        else if (checkAllPropertiesNull(dataArray[0]))
            throw "Null data from API";

        for (let data of dataArray) {
            data.ts = epochHelper.convertEpoch(data.ts);
            var query = { seq: data.seq },
                update = data,
                options = { upsert: true, new: true, setDefaultsOnInsert: true };

            await Model.findOneAndUpdate(query, update, options);
        }

        print(`[${jobName}] Fetch completed in ${(Date.now() - startTime) / 1000.0} seconds`);
    } catch (e) {
        print(`[${jobName}] ${e}`);
    } finally {
        //Close database connection
        DatabaseHelper.disconnect();
        process.exit(0);
    }
})();

function checkAllPropertiesNull(obj) {
    for (var prop in obj)
        if (obj[prop] != null) return false;
    return true;
}