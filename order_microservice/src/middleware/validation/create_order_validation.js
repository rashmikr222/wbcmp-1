

const createOrderValidation = (schema) => async (req, res, next) => {
    try {
        await schema.validate({
            body: req.body
        })
        return next()
    } catch (error) {
        return res.status(500).json({ type: error.name, message: error.message });
    }
}


module.exports = { createOrderValidation }