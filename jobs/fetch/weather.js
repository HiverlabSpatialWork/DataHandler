const { parentPort } = require("worker_threads");
function print(message) { if (parentPort != null) parentPort.postMessage(message); }

const axios = require('axios');
const DatabaseHelper = require('../../helper/DatabaseHelper');
const ModelHelper = require('../../helper/ModelHelper');
const mongoose = require('mongoose');
const epochHelper = require("../../helper/epoch-helper");
const Schema = mongoose.Schema;
const _ = require('underscore');

let jobName = "weather";
const Model = ModelHelper.models[jobName];

let isCancelled = false;
if (parentPort) {
    parentPort.once("message", (message) => {
        if (message === "cancel") isCancelled = true;
    });
}

const apiKey = "d821681b2e39512eb77af55a4c9070ac";
const cities = [
    {
        name: "Singapore",
        coord: "1.3643451175024932, 103.99140205345556",
    },
    {
        name: "Kuala Lumpur",
        coord: "2.741736879725114, 101.7013959668975",
    },
    {
        name: "Bangkok",
        coord: "13.69009289415676, 100.75043426692302",
    },
    {
        name: "Manila",
        coord: "14.512170014806186, 121.01646508334936",
    },
    {
        name: "Ho Chi Minh",
        coord: "10.818642230673973, 106.65917855412354",
    },
    {
        name: "Taipei",
        coord: "25.079826275757128, 121.23447449605155",
    },
    {
        name: "Sydney",
        coord: "-33.950141197994476, 151.18180511150277",
    },
    {
        name: "Auckland",
        coord: "-37.00605419484487, 174.79042152891049",
    },
    {
        name: "Hong Kong",
        coord: "22.308195856792018, 113.91859881993697",
    },
    {
        name: "Macau",
        coord: "22.15790542221993, 113.57669125179063",
    },
    {
        name: "Lugano",
        coord: "46.00451670560701, 8.910313348257548",
    },
    {
        name: "Milan",
        coord: "45.630182479540984, 8.726389015486303",
    },
];

(async () => {
    try {
        var startTime = new Date();
        print(`[${jobName}] Starting fetch on ${startTime.toISOString()}`);

        await DatabaseHelper.connect();

        var doc = {
            timestamp: new Date(),
            cities: cities
        };

        for (let city of doc.cities) {
            var split = city.coord.split(', ');
            var lat = split[0], lon = split[1];

            //Call the API and get its response
            var response = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=metric&appid=${apiKey}`);

            var data = response.data;

            city.current = _.pick(data.current, 'dt', 'temp', 'weather');
            city.current.dt = new Date(city.current.dt * 1000);
            city.current.weather = city.current.weather[0];

            city.hourly = _.chain(data.hourly)
                .map(h => _.pick(h, 'dt', 'temp', 'weather'))
                .map(h => {
                    h.dt = new Date(h.dt * 1000);
                    h.weather = h.weather[0];
                    return h;
                })
                .rest(1) // first entry is this hour
                .take(4);

            city.daily = _.chain(data.daily)
                .map(h => _.pick(h, 'dt', 'temp', 'weather'))
                .map(h => {
                    h.dt = new Date(h.dt * 1000);
                    h.weather = h.weather[0];
                    return h;
                })
                .rest(1) // first entry is today
                .take(4);
        }

        var query = { timestamp: doc.timestamp },
            update = doc,
            options = { upsert: true, new: true, setDefaultsOnInsert: true };

        await Model.findOneAndUpdate(query, update, options);

        print(`[${jobName}] Fetch completed in ${(Date.now() - startTime) / 1000.0} seconds`);
    } catch (e) {
        print(`[${jobName}] ${e}`);
    } finally {
        //Close database connection
        DatabaseHelper.disconnect();
        process.exit(0);
    }
})();