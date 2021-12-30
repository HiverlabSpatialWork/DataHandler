const modelPaths = {
    fetchBMSEnergy_Q1: '../models/fetch/model-fetchBMSEnergy_Q1',
    fetchBMSEnergy_Q2: '../models/fetch/model-fetchBMSEnergy_Q2',
    bms_energy: '../models/transform/model-bms_energy',
}

const models = {
    fetchBMSEnergy_Q1: require('../models/fetch/model-fetchBMSEnergy_Q1'),
    fetchBMSEnergy_Q2: require('../models/fetch/model-fetchBMSEnergy_Q2'),
    bms_energy: require('../models/transform/model-bms_energy'),
}

function isRawData(modelName) {
    return modelPaths[modelName].includes("models/fetch");
}

module.exports = {
    models,
    isRawData
};