const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modelName = 'fetchSKUMaster';
const schema = new Schema({
    SERIALKEY: { type: Number, index: true },
    WHSEID: String,
    STORERKEY: String,
    SKU: String,
    DESCR: String,
    PIECEUOM: String,
    PIECEQTY: Number,
    CASEUOM: String,
    CASEQTY: Number,
    ITEMLENGTH: Number,
    ITEMWIDTH: Number,
    ITEMHEIGHT: Number,
    ITEMCUBE: Number,
    ITEMWEIGHT: Number,
});

module.exports = mongoose.model(modelName, schema, modelName);