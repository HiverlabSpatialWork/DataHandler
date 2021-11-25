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

let jobName = "inv-loc-complete";

(async () => {
    try {
        await DatabaseHelper.connect();
        const Model = ModelHelper.getModel(ModelHelper.models.invLocComplete);

        //Call the API and get it's response
        const response = await axios.get('https://api.jsonbin.io/v3/b/617a44d5aa02be1d445fe4e9', {
            headers: {
                'X-Master-Key': '$2a$10$ATbIp5sWsYJxFcmG6Lx7OO7ckx9Zuf/et3KNaMF8V4w69TvcOuO8a'
            }
        });

        const data = response.data['record'];

        for (let eachData of data) {
            try {
                let hawb = eachData['HAWB'];

                //Remove "-" from HAWB
                const hawbArray = hawb.split("-");
                if (hawbArray.length > 1) hawb = hawbArray[0] + hawbArray[1];

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