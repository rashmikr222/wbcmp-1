const { default: axios } = require("axios")
const { CONSTANT_VARIABLES } = require("../config/config")
const { queryExecutor } = require("../utils/common")

console.log("CONSTANT_VARIABLES.BASE_URL=======", CONSTANT_VARIABLES.BASE_URL);
const isVettingExist = async (req, res, next) => {
    try {
        console.log("inside is vetting exist",req.params);
        const { role_id } = req.params
        console.log("🚀 ~ file: isVettingExist.js:10 ~ isVettingExist ~ role_id:", role_id)

        // /userinformation/:userId
        const isUserExist = await axios.get(`${CONSTANT_VARIABLES.BASE_URL}/userinformation/${role_id}`)
        // const sqlSearch = `SELECT role_name from user_info WHERE role_id = ${role_id}`
        console.log("🚀 ~ file: isVettingExist.js:13 ~ isVettingExist ~ isUserExist:", isUserExist)
        // const userRole = await queryExecutor(sqlSearch)
        // console.log("🚀 ~ file: isVettingExist.js:9 ~ isVettingExist ~ userRole:", userRole)

    } catch (error) {
        console.log("🚀 ~ file: isVettingExist.js:12 ~ isVettingExist ~ error:", error)

    }
}

module.exports = { isVettingExist }