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

(async () => {

    try {
        //Initiate database connection and define model that we need to use
        await DatabaseHelper.connect();

        //Initialize the model that you want to deal with
        const LoadinPlan = ModelHelper.getModel(ModelHelper.models.loadingPlan);
        const InvLocComplete = ModelHelper.getModel(ModelHelper.models.InvLocComplete);
        const FlightSchedule = ModelHelper.getModel(ModelHelper.models.FlightSchedule);

        //Start writing your code below
        /*
        Get MAWB using HAWB from Loading Plan
        Get Flight Schedule from InvFlightSchedule usnig MAWB
        Get Consignee details from InvLocComplete using HAWB
        */


        //Finish your code above

    } catch (e) {
        console.log(e);

    } finally {
        //Close database connection
        DatabaseHelper.disconnect();
        process.exit(0);
    }

})();