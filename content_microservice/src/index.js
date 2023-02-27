
const express = require('express')
const { expressApp } = require('../express-app')

const { CONSTANT_VARIABLES } = require('../src/config/config')

const app = express()

require('../src/database/connection')

const startServer = () => {
    expressApp(app)
    app.listen(CONSTANT_VARIABLES.PORT, () => {
        console.log("Server is up and running", CONSTANT_VARIABLES.PORT);
    })
}

startServer()

