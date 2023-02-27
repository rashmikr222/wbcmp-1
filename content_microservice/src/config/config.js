const dotenv = require('dotenv')
// const path = require('path')
// const envCmdrcPath = path.join(__dirname, "..", ".env-cmdrc")

dotenv.config()

const CONSTANT_VARIABLES = {
    "PORT": process.env.PORT,
    "HOST": process.env.HOST,
    "DB_USERNAME": process.env.USER_NAME,
    "DB_PASSWORD": process.env.PASSWORD,
    "DB_NAME": process.env.DATABASE_NAME,
    "NODE_ENV": process.env.NODE_ENV
}

module.exports = { CONSTANT_VARIABLES }