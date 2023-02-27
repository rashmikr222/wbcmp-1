const mysql = require('mysql')

const { CONSTANT_VARIABLES } = require('../config/config')

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
    multipleStatements: true
})

con.getConnection((err, connetion) => {
    if (err) { console.log("DB Error", +err) };
    console.log("Connected!");
})

module.exports = { con }