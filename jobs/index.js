const path = require("path");

const jobs = [];
jobs.push({
  name: path.join("bms_energy", "fetchBMSEnergy_Q1"),
  cron: "0 * * * *", // on minute 0 of every hour
  timeout: 0, // run on start
});
jobs.push({
  name: path.join("bms_energy", "fetchBMSEnergy_Q2"),
  cron: "0 * * * *", // on minute 0 of every hour
  timeout: 0,
});
jobs.push({
  name: path.join("bms_energy", "bms_energy"),
  cron: "1 * * * *", // on minute 1 of every hour
  timeout: 0,
});

module.exports = {
  jobs,
};
