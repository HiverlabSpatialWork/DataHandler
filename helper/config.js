const {
    DB_USER = 'hiverlab',
    DB_PASSWORD = 'hiverlab123',
    DB_HOST = '127.0.0.1',
    DB_PORT = '3000',
    DB_NAME = 'data-handler',
} = process.env;

module.exports = {
    //url: `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`
    url: `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`
};