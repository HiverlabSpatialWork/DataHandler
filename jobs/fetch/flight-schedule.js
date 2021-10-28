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

(async () => {

    try {
        await DatabaseHelper.connect();
        const Model = ModelHelper.getModel(ModelHelper.models.invFlightSchedule);

        //Call the API and get it's response
        const response = await axios.get('https://api.jsonbin.io/v3/b/617a51a59548541c29c9a284', {
            headers: {
                'X-Master-Key': '$2a$10$ATbIp5sWsYJxFcmG6Lx7OO7ckx9Zuf/et3KNaMF8V4w69TvcOuO8a'
            }
        });

        const data = response.data['record'];

        for (let eachData of data) {
            try {
                let mawb = eachData['MAWB'];

                //Remove "-" from HAWB
                const mawbArray = mawb.split("-");
                if (mawbArray.length > 1) mawb = mawbArray[0] + mawbArray[1];

                var query = { MAWB: eachData['MAWB'] },
                    update = eachData,
                    options = { upsert: true, new: true, setDefaultsOnInsert: true };

                await Model.findOneAndUpdate(query, update, options);
            } catch (e) {
                console.log(e);
            }

        }
    } catch (e) {
        console.log(e);

    } finally {
        //Close database connection
        DatabaseHelper.disconnect();
        process.exit(0);
    }


})();