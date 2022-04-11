// collections that store data in a 'sql-like' way
const rawDataModels = {
    fetchBMSEnergy_Q1: '../jobs/bms_energy/model-fetchBMSEnergy_Q1',
    fetchBMSEnergy_Q2: '../jobs/bms_energy/model-fetchBMSEnergy_Q2',
}

// collections that store data in 'snapshots', and has a timestamp for each entry
const transformedDataModels = {
    bms_energy: '../jobs/bms_energy/model-bms_energy',
}

const models = {
    fetchBMSEnergy_Q1: require(rawDataModels.fetchBMSEnergy_Q1),
    fetchBMSEnergy_Q2: require(rawDataModels.fetchBMSEnergy_Q2),

    bms_energy: require(transformedDataModels.bms_energy),
}

function isRawData(modelName) {
    return modelName in rawDataModels;
}

module.exports = {
    models,
    isRawData
};