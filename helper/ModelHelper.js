const baseModelPath = "../model/";

const models = {
    loadingPlan: "raw/loading-plan.js"
}


function getModel(modelName) {

    let model;

    switch (modelName) {
        case rawModels.loadingPlan:
            model = require(baseModelPath + modelName);
            return model;
            break;
    }
}

module.exports = {
    getModel,
    models
}