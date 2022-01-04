'use strict';
const express = require('express');
const router = express.Router();
const ModelHelper = require('../helper/ModelHelper')

router.get("/", async function (req, res) {
    res.send("Yo! Data handler is running");
});

router.post("/", async function (req, res) {
    let skip = 0;
    let limit = 10;
    let modelToQuery = undefined;

    if (req.body.skip) skip = req.body.skip;
    if (req.body.limit) limit = req.body.limit;
    if (req.body.model) modelToQuery = req.body.model;

    let Model;
    if (modelToQuery) {
        //If model is passed in parameter, will be loaded here
        Model = ModelHelper.getModel(modelToQuery);
    } else {
        //Can hardcode if you don't want to pass in parameter
        Model = ModelHelper.getModel(ModelHelper.models.latData);
    }

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