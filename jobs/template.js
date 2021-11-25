const { parentPort } = require("worker_threads");
const axios = require('axios');
const ModelHelper = require('../helper/ModelHelper');
const DatabaseHelper = require('../helper/DatabaseHelper');

let isCancelled = false;
if (parentPort) {
    parentPort.once("message", (message) => {
        if (message === "cancel") isCancelled = true;
    });
}

let jobName = "my-fetch-job";

(async () => {
    try {
        //Initiate database connection and define model that we need to use
        await DatabaseHelper.connect();

        //Initialize the model that you want to deal with. For example, I have used loading plan model here
        const Model = ModelHelper.getModel(ModelHelper.models.loadingPlan);

        //Start writing your code below

        //Finish your code above

        console.log(`[${jobName}] Fetch complete`);
    } catch (e) {
        console.log(`[${jobName}] ${e}`);
    } finally {
        //Close database connection
        DatabaseHelper.disconnect();
        process.exit(0);
    }
})();