const { queryExecutor } = require("../../utils/common")

const isOrderIdUnique = async (req, res, next) => {
    try {
        const { project_order_id } = req.body
        const sqlSearch = `SELECT * FROM order_info WHERE project_order_id=${project_order_id}`
        const isOrderIdUnique = await queryExecutor(sqlSearch)
        console.log("🚀 ~ file: order_id_validation.js:8 ~ isOrderIdUnique ~ isOrderIdUnique:", isOrderIdUnique)
        console.log("🚀 ~ file: order_id_validation.js:8 ~ isOrderIdUnique ~ sqlSearch:", sqlSearch)
        if (isOrderIdUnique.length > 0) {
            return res.status(209).send({ message: "order id must be unique" })
        }
        next()
    } catch (error) {
        return res.status(500).json({ type: error.name, message: error.message });
    }
}

module.exports = { isOrderIdUnique }