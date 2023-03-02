const express = require('express')
const cors = require('cors')

const order_routes = require('../src/routes/order_routes')

const expressApp = (app) => {
    app.use(cors())

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    app.use('/api', order_routes)


}

module.exports = { expressApp }