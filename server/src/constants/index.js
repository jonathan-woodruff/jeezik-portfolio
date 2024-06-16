const { config } = require('dotenv');
config();

const isProduction = false;

module.exports = {
    PORT: process.env.PORT,
    CLIENT_URL: isProduction ? process.env.CLIENT_URL_PRODUCTION : process.env.CLIENT_URL_LOCAL,
    SERVER_URL: isProduction ? process.env.SERVER_URL_PRODUCTION : process.env.SERVER_URL_LOCAL,
    SECRET: process.env.SECRET,
    //database constants
    DB_USER: isProduction ? process.env.DB_USER_PRODUCTION : process.env.DB_USER_LOCAL,
    DB_HOST: isProduction ? process.env.DB_HOST_PRODUCTION :  process.env.DB_HOST_LOCAL,
    DB_DATABASE: isProduction ? process.env.DB_DATABASE_PRODUCTION : process.env.DB_DATABASE_LOCAL,
    DB_PASSWORD: isProduction ? process.env.DB_PASSWORD_PRODUCTION : process.env.DB_PASSWORD_LOCAL,
    DB_PORT: process.env.DB_PORT
};