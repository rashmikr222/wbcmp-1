// const createHttpError = require("http-errors");
const { queryExecutor } = require("../../utils/common")

const isValidOrderId = async (req, res, next) => {
    try {
        console.log("inside valid order id");
        const { orderId } = req.params
        // console.log("🚀 ~ file: get_order_id_validation.js:8 ~ isValidOrderId ~ req.params.orderId:", req.params.orderId)
        console.log("🚀 ~ file: get_order_id_validation.js:8 ~ isValidOrderId ~ orderId:", orderId)

        if (orderId == ":orderId" || orderId == "{orderId}" || orderId == undefined) {
            console.log("inside if");
            return res.status(400).send({
                message: 'Please enter valid project id'
            })
        }

        const sqlSearch = `SELECT * from order_info WHERE project_order_id =${orderId}`
        const getOrderQuery = await queryExecutor(sqlSearch)
        console.log("🚀 ~ file: order_controller.js:71 ~ getOrder ~ getOrderQuery:", getOrderQuery)
        if (getOrderQuery.length == 0) {
            return res.status(404).send({
                message: "Please enter valid project id"
            })
        }
        return next()

    } catch (error) {
        return res.status(500).json({ type: error.name, message: error.message })
    }
}

module.exports = { isValidOrderId }