const express = require('express')
const cors = require('cors')

const VettingDashboardRoutes = require('./src/routes/vetting_dashboard')

const expressApp = (app) => {
    app.use(cors())
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    app.use('/api',VettingDashboardRoutes)
}

module.exports = { expressApp }