'use strict';
const express = require('express');
const router = express.Router();
const ModelHelper = require('../helper/ModelHelper')

router.post("/", async function (req, res) {

    let skip = 0;
    let limit = 10;
    const Model = ModelHelper.getModel(ModelHelper.models.latData);

    if (req.query.skip) skip = req.query.skip;
    if (req.query.limit) limit = req.query.limit;

    //Apply query based on request parameters if required
    //req.params will give you url parameters (for ex: domain.com?skip=20&limit=10)
    //req.body will give you form-body parameters

    const query = Model.find(
        {
            parameterA: 13
        },
        {
            parameterB: "XYZ"
        }
    ).sort({ time: -1 })

    const count = await query.count()
    const records = await query.skip(skip)
        .limit(limit).toArray()
    res.send(200, records, count);
});

module.exports = router;
