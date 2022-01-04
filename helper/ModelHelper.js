const modelPaths = {
    fetchBMSEnergy_Q1: '../models/fetch/model-fetchBMSEnergy_Q1',
    fetchBMSEnergy_Q2: '../models/fetch/model-fetchBMSEnergy_Q2',
    bms_energy: '../models/transform/model-bms_energy',
    weather: '../models/fetch/model-weather.js',
    fetchOrdersData: '../models/fetch/model-fetchOrdersData',
    fetchOrderDetailData: '../models/fetch/model-fetchOrderDetailData',
    fetchPickDetailData: '../models/fetch/model-fetchPickDetailData',
    fetchSKUMaster: '../models/fetch/model-fetchSKUMaster',
    fetchAFCLShipments: '../models/fetch/model-fetchAFCLShipments',
    outbound_orders: '../models/transform/model-outbound_orders',
}

const models = {
    fetchBMSEnergy_Q1: require(modelPaths.fetchBMSEnergy_Q1),
    fetchBMSEnergy_Q2: require(modelPaths.fetchBMSEnergy_Q2),
    bms_energy: require(modelPaths.bms_energy),
    weather: require(modelPaths.weather),
    fetchOrdersData: require(modelPaths.fetchOrdersData),
    fetchOrderDetailData: require(modelPaths.fetchOrderDetailData),
    fetchPickDetailData: require(modelPaths.fetchPickDetailData),
    fetchSKUMaster: require(modelPaths.fetchSKUMaster),
    fetchAFCLShipments: require(modelPaths.fetchAFCLShipments),
    outbound_orders: require(modelPaths.outbound_orders),
}

function isRawData(modelName) {
    return modelPaths[modelName].includes("models/fetch");
}

module.exports = {
    models,
    isRawData
};