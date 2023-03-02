const yup = require('yup')

const createUserSchema = yup.object({
    body: yup.object({
        fullName: yup.string().required("User name is required"),
        email: yup.string().required('User email is required'),
        phoneNumber: yup.number().required('User phone number is required'),
        password: yup.string().required("User password is required")
    })
})

const userLoginSchema = yup.object({
    body: yup.object({
        email: yup.string().required('User email is required'),
        password: yup.string().required("User password is required")
    })
})

const userForgotPasswordSchema = yup.object({
    body: yup.object({
        email: yup.string().required('User email is required')
    })
})
module.exports = { createUserSchema, userLoginSchema,userForgotPasswordSchema }