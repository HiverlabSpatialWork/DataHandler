'use strict';
const express = require('express');
const router = express.Router();
const mqtt = require('mqtt')
require('dotenv').config();

let client;
//const mqttHelper = require("../helper/mqttHelper");

router.post("/connect", async (req, res) => {
    try {
        const brokerURL = req.body.url;
        console.log(brokerURL);
        client = mqtt.connect(brokerURL);
        client.on('connect', function () {
            console.log("Connected to broker");
        })

        res.send("Connected to broker");
    } catch (e) {
        console.log(e);
        res.send("Cannot connect");
    }

});

router.post("/subscribeAndListen", async (req, res) => {
    const topic = req.body.topic;
    if (!client) console.log("Client is null");

    client.subscribe(topic, function (err) {
        if (!err) {
            console.log("Subscibed");
            client.on('message', function (topic, message) {
                console.log(topic.toString(), message.toString())
            })
        } else res.send(err);
    })


    return res.send("Subscribed and listening...");
});

router.post("/publish", async (req, res) => {
    const { topic, message } = req.body;
    client.publish(topic, message)
    res.send("Message published");
});

module.exports = router;