const baseModelPath = "../model/";

const models = {
    loadingPlan: "raw/loading-plan.js",
    invLocComplete: "raw/inv-loc-complete.js",
    invFlightSchedule: "raw/inv-flight-schedule",
    latData: "transformed/lat-data"
}

function getModel(modelName) {
    model = require(baseModelPath + modelName);
    return model;
}

module.exports = {
    getModel,
    models
}