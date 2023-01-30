const path = require("path");

/**
 * ===== Add your job definitions here =====
 * 
 * Sample job setup:
 * ```
 * {
 *   name: path.join("my_folder_name", "my_sample_job"),
 *   timeout: 0, // run on start
 *   interval: '1m', // run every one minute
 * }
 * ```
 */
const jobs = [
  {
    name: path.join('samples', 'psi_snapshot'),
    timeout: 0, // run on start
    interval: '1h', // run every one hour
  },
  {
    name: path.join('samples', 'psi_rows'),
    timeout: 0, // run on start
    interval: '1h', // run every one hour
  },
  {
    name: path.join('samples', 'mqtt_sample'),
    timeout: 0, // run on start
  },
  {
    name: path.join('samples', 'websocket_sample'),
    timeout: 0, // run on start
  },
  {
    name: path.join('samples', 'mysql_sample'),
    timeout: 0, // run on start
  },
];

module.exports = jobs;
