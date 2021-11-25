const { parentPort } = require("worker_threads");
const axios = require('axios');
const ModelHelper = require('../../helper/ModelHelper');
const DatabaseHelper = require('../../helper/DatabaseHelper');

let isCancelled = false;
if (parentPort) {
    parentPort.once("message", (message) => {
        if (message === "cancel") isCancelled = true;
    });
}

let jobName = "loading-plan";

(async () => {
    try {
        await DatabaseHelper.connect();
        const Model = ModelHelper.getModel(ModelHelper.models.loadingPlan);

        //Call the API and get it's response
        const response = await axios.get('https://api.jsonbin.io/v3/b/616c61944a82881d6c6179f4', {
            headers: {
                'X-Master-Key': '$2a$10$ATbIp5sWsYJxFcmG6Lx7OO7ckx9Zuf/et3KNaMF8V4w69TvcOuO8a'
            }
        });
        const data = response.data['record'];

        //Loop through the data to store new records in database
        //Here we have considered that HAWB is unique for each record, so if HAWB exist in database, the entry will be updated
        //else new entry will be created
        for (let eachData of data) {
            try {
                const hawb = eachData['HAWB'];
                const mawb = eachData['MAWB'];

                const hawbArray = hawb.split("-");
                const mawbArray = mawb.split("-");

                if (hawbArray.length > 1) eachData['HAWB'] = hawbArray[0] + hawbArray[1];
                if (mawbArray.length > 1) eachData['MAWB'] = mawbArray[0] + mawbArray[1];

                var query = { HAWB: eachData['HAWB'] },
                    update = eachData,
                    options = { upsert: true, new: true, setDefaultsOnInsert: true };

                await Model.findOneAndUpdate(query, update, options);
            } catch (e) {
                console.log(e);
            }
        }

        console.log(`[${jobName}] Fetch complete`);
    } catch (e) {
        console.log(`[${jobName}] ${e}`);
    } finally {
        //Close database connection
        DatabaseHelper.disconnect();
        process.exit(0);
    }
})();