require('dotenv').config()

const config = {
 key: process.env.KEY,
 secret: process.env.SECRET,
 sessionsecret: process.env.SESSIONSECRET
}

module.exports = config
