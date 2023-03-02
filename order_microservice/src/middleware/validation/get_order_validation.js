

const getOrderValidate = (schema) => async (req, res, next) => {
    try {
        await schema.validate({
            params: req.params.id
        })
        return next()
    } catch (error) {
        return res.status(500).json({ type: error.name, message: error.message });
    }
}

module.exports = { getOrderValidate }