'use strict';
const express = require('express');
const router = express.Router();
const { Parser } = require('json2csv');

const Logger = require('../helpers/logger');
const mongo = require('../helpers/mongo');
const ModelHelper = require('../models/models')

const logger = new Logger("api", 0);

router.get('/*', async (req, res, next) => {
    let modelToQuery = req.baseUrl.replace('/', '');

    // reject file requests, e.g. favicon.ico
    if (modelToQuery.match(/\..*/gm)) return;

    let sort = "";
    let skip = 0;
    let limit = 100;

    if (req.query.sort)
        sort = req.query.sort;
    if (req.query.skip)
        skip = parseInt(req.query.skip);
    if (req.query.limit)
        limit = parseInt(req.query.limit);

    try {
        await mongo.connect();

        let Model = ModelHelper.getModel(modelToQuery);

        // Apply query based on request parameters if required
        // req.query will give you url parameters (e.g. domain.com?skip=20&limit=10)
        let records;
        if (ModelHelper.isSqlDataModel(modelToQuery)) {
            records = await Model.find()
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .select('-_id -__v')
                .lean();
            let csv = new Parser({ quote: "" })
                .parse(records);
            res.status(200).send(csv);
        }
        else {
            records = await Model.findOne()
                .sort('-timestamp')
                .select('-__v -_id');
            res.status(200).json(records);
        }

        logger.log(`200 ${req.originalUrl}`);
    } catch (e) {
        let errorMsg = "";
        if (e.message.includes("Cannot read properties of undefined"))
            errorMsg = `Invalid collection name: ${modelToQuery}`;
        else
            errorMsg = e.message;

        res.status(400).json({ error: errorMsg });
        logger.error(`400 ${errorMsg}`)
    } finally {
        mongo.disconnect();
    }
});

module.exports = router;