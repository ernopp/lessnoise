require('dotenv').config();

const config = {
 key: process.env.KEY,
 secret: process.env.SECRET
};

module.exports = config;
