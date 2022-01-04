const { parentPort } = require("worker_threads");
function print(message) { if (parentPort != null) parentPort.postMessage(message); }

const axios = require('axios');
const DatabaseHelper = require('../../helper/DatabaseHelper');
const ModelHelper = require('../../helper/ModelHelper');
const mongoose = require('mongoose');
const epochHelper = require("../../helper/epoch-helper");
const Schema = mongoose.Schema;

let jobName = "fetchPickDetailData";
const Model = ModelHelper.models[jobName];

let isCancelled = false;
if (parentPort) {
    parentPort.once("message", (message) => {
        if (message === "cancel") isCancelled = true;
    });
}

(async () => {
    try {
        var startTime = Date.now();

        await DatabaseHelper.connect();

        //Call the API and get its response
        var response = await axios.post('http://10.236.20.23/ccApp/Service1.svc/fetchPickDetailData', {
            data: '{["IDENTIFIER":"Hiverlab"]}',
        });

        print(`[${jobName}] API call completed in ${(Date.now() - startTime) / 1000.0} seconds`);

        const dataArray = response.data;

        if (dataArray.length == 0)
            throw "Empty data from API";
        else if (checkAllPropertiesNull(dataArray[0]))
            throw "Null data from API";

        for (let data of dataArray) {
            for (var prop in data) {
                if ((prop.endsWith('DATE') || prop.endsWith('TIME')) &&
                    data[prop] != null)
                    data[prop] = epochHelper.convertEpoch(data[prop]);
            }

            var query = { SERIALKEY: data.SERIALKEY },
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