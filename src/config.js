require('dotenv').config();

module.exports = {
    app: {
        port: process.env.PORT
    },
    mongodb: {
        database: process.env.URL_DB
    }
}