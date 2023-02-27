const { con } = require('../database/connection')

const queryExecutor = (query) => {
    return new Promise((resolve, reject) => {
        con.query(query, (err, result) => {
            if (err) {
                return reject(err)
            }
            return resolve(result)
        })
    })
}

// database strings
const TABLE_NAME = {
    USER: 'user_info',
    SESSION: "user_session_info"
}

const TABLE_COLUMN = {
    USER_INFO_ID: "user_info_id",
    DEVICE_IP_ADDRESS: "device_ip_address",
    SESSION_START_TIME: "session_start_time",
    SESSION_END_TIME: "session_end_time",
    // 
    FULLNAME: "fullName",
    EMAIL: "email",
    PHONENUMBER: "phoneNumber",
    ROLE_ID: "role_id"
}

const SQLQUERYSTRING = {
    INSERT_USER: `INSERT INTO ${TABLE_NAME.USER} (${TABLE_COLUMN.FULLNAME}, ${TABLE_COLUMN.EMAIL},${TABLE_COLUMN.PHONENUMBER},${TABLE_COLUMN.ROLE_ID}) VALUES(':fullName', ':email',':phoneNumber',':role_id')`,
    SELECT_USER: `SELECT email FROM ${TABLE_NAME.USER}`,

    // INSERT_SESSION:`INSERT INTO ${TABLE_NAME.SESSION}` ()
}

module.exports = { queryExecutor, SQLQUERYSTRING }