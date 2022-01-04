'use strict';
const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post("/events", async function (req, res) {
    const baseURL = process.env.DISASTER_BASE_URL;
    const data = req.body;
    let query = "&";

    if (data.place)
        query = query + "place.scope=" + data.place + "&";

    if (data.start_date)
        query = query + "&active.gte=" + data.start_date + "&";

    if (data.end_date)
        query = query + "&active.lte=" + data.end_date + "&";

    console.log(baseURL + "events?category=disasters" + query);

    const headers = {
        headers: {
            Authorization: 'Bearer Po_3Hy3q3_C4X1nFiiw3yCwbdApfkppOA5pZ87lq'
        }
    }

    const result = await axios.get(baseURL + "events?category=disasters" + query, headers);
    const response = result.data;

    res.json(response);
});

module.exports = router;