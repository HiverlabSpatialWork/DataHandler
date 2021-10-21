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

    //Initiate database connection and define model that we need to use
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
    for (let eachData of data) {
        try {
            var query = { HAWB: eachData['HAWB'] },
                update = eachData,
                options = { upsert: true, new: true, setDefaultsOnInsert: true };

            await Model.findOneAndUpdate(query, update, options);
        } catch (e) {
            console.log(e);
        }

    }

    //Close database connection
    DatabaseHelper.disconnect();
    process.exit(0);

})();