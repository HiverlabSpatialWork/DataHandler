# Data Handler

Data Handler is a template repository to allow you to fetch and save data to a MongoDB database and serve it via API.

## Requirements
- Node.js
- MongoDB Database

## Setup
1. Fork this repository to your own GitHub account.
2. Clone the forked repository to your local machine.
    ```bash 
    git clone https://github.com/<YOUR_USERNAME>/mysql-fetch-sample.git
    ```
3. Install the required nodejs dependencies.
    ```
    npm install
    ```

## Usage
### Add a new job
1. Define your job name, e.g. my_new_job
2. Create a folder in `jobs/` and create a new `my_new_job.js` file inside.
   - Define your job logic. See any of the [job samples](./jobs/samples/) for reference.
3. Add a new job definition in [`jobs/jobs.js`](./jobs/jobs.js), in the `jobs` array:
    ```js
    {
        name: path.join('my_folder', 'my_new_job'),
        timeout: 0,
        interval: '1h',
    }
    ```
4. Create the same folder in `model/` and create a new `model-my_new_job.js` file inside.
   - Define your MongoDB collection schema. See any of the [model samples](./models/samples/) for reference.
5. Add a new model definition in [`models/models.js`](./models/models.js).
    If your collection stores data in rows, add it to `rowDataModels`.
    If your collection stores data in snapshots, add it to `snapshotDataModels`.
    ```js
    my_new_job: require('./my_folder/my_new_job'),
    ```

## Additional Resources
- [bree npm package](https://github.com/breejs/bree)
- [mongoose npm package](https://github.com/Automattic/mongoose)
- [mqtt npm package](https://github.com/mqttjs/MQTT.js)
- [mysql npm package](https://github.com/mysqljs/mysql)
- [ws npm package](https://github.com/websockets/ws)
- [axios npm package](https://github.com/axios/axios)

## Support
For any issues or support requests, please create an issue on the repository.
