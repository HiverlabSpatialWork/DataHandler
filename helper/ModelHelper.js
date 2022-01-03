const modelPaths = {
    fetchBMSEnergy_Q1: '../models/fetch/model-fetchBMSEnergy_Q1',
    fetchBMSEnergy_Q2: '../models/fetch/model-fetchBMSEnergy_Q2',
    bms_energy: '../models/transform/model-bms_energy',
    weather: '../models/fetch/model-weather.js',
}

const models = {
    fetchBMSEnergy_Q1: require(modelPaths.fetchBMSEnergy_Q1),
    fetchBMSEnergy_Q2: require(modelPaths.fetchBMSEnergy_Q2),
    bms_energy: require(modelPaths.bms_energy),
    weather: require(modelPaths.weather),
}

function isRawData(modelName) {
    return modelPaths[modelName].includes("models/fetch");
}

module.exports = {
    models,
    isRawData
};