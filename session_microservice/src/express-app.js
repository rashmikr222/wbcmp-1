const express = require('express')
const cors = require('cors')

const authRoutes = require('../src/routes/auth_routes')
const { CONSTANT_VARIABLES } = require('./config/config')

const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('auth.yaml')


const expressApp = (app) => {

    app.use(cors())
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    // swagger documentation
    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

    // authRoutes
    app.use('/api', authRoutes)
    // error middleware
    app.use((error, req, res, next) => {
        let status = error.status || 500
        let message = error.message || "Internal Server Error"
        console.log("🚀 ~ file: express-app.js:12 ~ app.use ~ message", status, message)
        res.send({
            status: status,
            message: message
        })

    })
}

module.exports = { expressApp }
