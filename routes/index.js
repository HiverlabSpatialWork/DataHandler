'use strict';
var express = require('express');
var router = express.Router();


router.get("/", async function (req, res) {
    const Model = require('../model/raw/loading-plan');
    const allData = await Model.find();
    res.send(allData);
});

module.exports = router;
