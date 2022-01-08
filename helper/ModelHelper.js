const modelPaths = {
}

// collections that store data in a 'sql-like' way
const rawDataModels = {
    fetchBMSEnergy_Q1: '../models/fetch/model-fetchBMSEnergy_Q1',
    fetchBMSEnergy_Q2: '../models/fetch/model-fetchBMSEnergy_Q2',
    fetchOrdersData: '../models/fetch/model-fetchOrdersData',
    fetchOrderDetailData: '../models/fetch/model-fetchOrderDetailData',
    fetchPickDetailData: '../models/fetch/model-fetchPickDetailData',
    fetchSKUMaster: '../models/fetch/model-fetchSKUMaster',
    fetchAFCLShipments: '../models/fetch/model-fetchAFCLShipments',
    outbound_orders: '../models/transform/model-outbound_orders',
}

// collections that store data in 'snapshots', and has a timestamp for each entry
const transformedDataModels = {
    bms_energy: '../models/transform/model-bms_energy',
    weather: '../models/fetch/model-weather.js',
    outbound_alerts: '../models/transform/model-outbound_alerts',
    inbound_alerts: '../models/transform/model-inbound_alerts',
    flights: '../models/transform/model-flights.js',
}

const models = {
    fetchBMSEnergy_Q1: require(rawDataModels.fetchBMSEnergy_Q1),
    fetchBMSEnergy_Q2: require(rawDataModels.fetchBMSEnergy_Q2),
    fetchOrdersData: require(rawDataModels.fetchOrdersData),
    fetchOrderDetailData: require(rawDataModels.fetchOrderDetailData),
    fetchPickDetailData: require(rawDataModels.fetchPickDetailData),
    fetchSKUMaster: require(rawDataModels.fetchSKUMaster),
    fetchAFCLShipments: require(rawDataModels.fetchAFCLShipments),
    outbound_orders: require(rawDataModels.outbound_orders),

    bms_energy: require(transformedDataModels.bms_energy),
    weather: require(transformedDataModels.weather),
    outbound_alerts: require(transformedDataModels.outbound_alerts),
    inbound_alerts: require(transformedDataModels.inbound_alerts),
    flights: require(transformedDataModels.flights),
}

function isRawData(modelName) {
    return modelName in rawDataModels;
}

module.exports = {
    models,
    isRawData
};