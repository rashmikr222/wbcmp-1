const dotenv = require('dotenv')
const path = require('path')

const envCmdrcPath = path.join(__dirname, "..", ".env-cmdrc")
console.log("==========>", envCmdrcPath);
dotenv.config({ path: envCmdrcPath })
const SESSION_END_TIME = 1000 * 60 * 60 * 30 * 24
const CONSTANT_VARIABLES = {
    "PORT": process.env.PORT,
    "HOST": process.env.HOST,
    "DB_USERNAME": 'root', //process.env.USERNAME,
    "DB_PASSWORD":  "Rishabh@Mysql01",//process.env.PASSWORD,
    "DB_NAME": process.env.DATABASE_NAME,
    "URL_FETCH_USERINFO": process.env.URL_FETCH_USERINFO,
    "SESSION_LIFETIME": SESSION_END_TIME,
    "SESSION_NAME": process.env.SESSION_NAME,
    "SESSION_SECRET": process.env.SESSION_SECRET,
"NODE_ENV":process.env.NODE_ENV,
    "AUTH0_DOMAIN": process.env.AUTH0_DOMAIN,
    "AUTH0_CLIENTID": process.env.AUTH0_CLIENTID,
    "AUTH0_CLIENTSECRET": process.env.AUTH0_CLIENTSECRET,
    "CONNECTION": process.env.CONNECTION
}

module.exports = { CONSTANT_VARIABLES }