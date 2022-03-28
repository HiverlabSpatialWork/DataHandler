'use strict';
const express = require('express');
const router = express.Router();

//const mqttHelper = require("../helper/mqttHelper");

router.post("/subscribe", async (req, res) => {
    const topic = req.body.topic;
    mqttHelper.subscribeAndListen(topic);
    return res.send("Subscribed");
});

router.post("/publish", async (req, res) => {
    const { topic, message } = req.body
    mqttHelper.sendMessage(topic, message);
    return res.send("Message Published");
});

module.exports = router;