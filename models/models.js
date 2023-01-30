const { Model } = require('mongoose');

/**
 * ADD HERE: 
 * Collections that store data in a rows
*/
const rowsDataModels = {
    psi_rows: require('./samples/psi_rows'),
}

/**
 * ADD HERE: 
 * Collections that store data in 'snapshots', each entry must have a 
 * `timestamp` property
 */
const snapshotDataModels = {
    psi_snapshot: require('./samples/psi_snapshot'),
    mqtt_sample: require('./samples/mqtt_sample'),
    websocket_sample: require('./samples/websocket_sample'),
    mysql_sample: require('./samples/mysql_sample'),
}

const models = { ...rowsDataModels, ...snapshotDataModels };

/**
 * Check if provided model name is a rows data model
 * @param {String} modelName Name of the model to check
 * @returns {boolean} True if the model is a rows data model
 */
function isRowsDataModel(modelName) {
    return modelName in rowsDataModels;
}

/**
 * Check if provided model name is a snapshot data model
 * @param {String} modelName Name of the model to check
 * @returns {boolean} True if the model is a snapshot data model
 */
function isSnapshotDataModel(modelName) {
    return modelName in snapshotDataModels;
}

/**
 * Retrieve the `Model` from the list of user-defined models
 * @param {String} modelName Name of the model to retrieve
 * @returns {Model} The `Model` matching `modelName`. Null if the model doesn't exist.
 */
function getModel(modelName) {
    return models.hasOwnProperty(modelName) ? models[modelName] : null;
}

module.exports = {
    getModel,
    isSqlDataModel: isRowsDataModel,
    isSnapshotDataModel,
};