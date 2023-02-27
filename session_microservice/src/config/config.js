const dotenv = require('dotenv')
const path = require('path')

const envCmdrcPath = path.join(__dirname, "..", ".env-cmdrc")
console.log("==========>", envCmdrcPath);
dotenv.config({ path: envCmdrcPath })
const SESSION_END_TIME = 1000 * 60 * 60 * 30 * 24
const CONSTANT_VARIABLES = {
    "PORT": process.env.PORT,
    "HOST": process.env.HOST,
    "DB_USERNAME": process.env.USERNAME,
    "DB_PASSWORD": process.env.PASSWORD,
    "DB_NAME": process.env.DATABASE_NAME,
    "URL_FETCH_USERINFO": process.env.URL_FETCH_USERINFO,
    "SESSION_LIFETIME": SESSION_END_TIME,
    "SESSION_NAME": process.env.SESSION_NAME,
    "SESSION_SECRET": process.env.SESSION_SECRET
}

module.exports = { CONSTANT_VARIABLES }