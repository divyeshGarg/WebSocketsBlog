const dotenv = require('dotenv');
dotenv.config();

const BACKEND_SERVER_URI = process.env.REACT_APP_BACKEND_SERVER_URI;

module.exports = {BACKEND_SERVER_URI};