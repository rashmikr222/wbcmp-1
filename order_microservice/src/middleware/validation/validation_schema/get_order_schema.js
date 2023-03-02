const yup = require('yup')


const getOrderSchema = yup.object({
    params: yup.number({
        id: yup.number().required('please enter valid project order number')
    })
})

module.exports = { getOrderSchema }