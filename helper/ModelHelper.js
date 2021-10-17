const baseModelPath = "../model/";

const rawModels = {
    loadingPlan: "raw/loading-plan.js"
}

function getRawModel(modelName) {

    let model;

    switch (modelName) {
        case rawModels.loadingPlan:
            model = require(baseModelPath + modelName);
            return model;
            break;
    }
}

module.exports = {
    getRawModel,
    rawModels
}