const mysql = require('mysql');
const { CONSTANT_VARIABLES } = require('../config/config') //for importing variables from .env files

console.log("host:", CONSTANT_VARIABLES.HOST,
    " user:", CONSTANT_VARIABLES.DB_USERNAME,
    "password:", CONSTANT_VARIABLES.DB_PASSWORD,
    "  database:", CONSTANT_VARIABLES.DB_NAME,);

const con = mysql.createPool({
    connectionLimit: 1000,
    connectTimeout: 60 * 60 * 1000,
    acquireTimeout: 60 * 60 * 1000,
    timeout: 60 * 60 * 1000,
    host: CONSTANT_VARIABLES.HOST,
    user: CONSTANT_VARIABLES.DB_USERNAME,
    password: CONSTANT_VARIABLES.DB_PASSWORD,
    database: CONSTANT_VARIABLES.DB_NAME,
    debug: false,
    multipleStatements: true,
});
console.log("--------------------------", process.env.DB_NAME);

con.getConnection(function (err, connection) {

    // Use the connection
    if (err) {
        console.log("DB Error" + err);
    } else {
        console.log("Connected");
    }
});
module.exports = { con }
