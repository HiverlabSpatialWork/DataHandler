'use strict';
const express = require('express');
const router = express.Router();
const ModelHelper = require('../helper/ModelHelper')
const DatabaseHelper = require('../helper/DatabaseHelper');

router.get('/', async function (req, res, next) {
    let modelToQuery = req.baseUrl.replace('/', '');
    let sort = "";
    let skip = 0;
    let limit = 10;

    if (req.query.sort) sort = req.query.sort;
    if (req.query.skip) skip = parseInt(req.query.skip);
    if (req.query.limit) limit = parseInt(req.query.limit);

    try {
        //Initiate database connection and define model that we need to use
        await DatabaseHelper.connect();

        let Model = ModelHelper.models[modelToQuery];

        //Apply query based on request parameters if required
        //req.params will give you url parameters (for ex: domain.com?skip=20&limit=10)

        var records;
        if (ModelHelper.isRawData(modelToQuery)) {
            records = await Model.find()
                .sort(sort)
                .skip(skip)
                .limit(limit);
        }
        else {
            records = await Model.findOne()
                .sort({ timestamp: -1 })
                .select('timestamp data');
        }

        res.status(200).json(records);
    } catch (e) {
        res.status(400).json({ error: e.message });
        //res.status(400).json({ error: `Invalid path of ${modelToQuery}` });
    } finally {
        //Close database connection
        DatabaseHelper.disconnect();
    }
});

module.exports = router;