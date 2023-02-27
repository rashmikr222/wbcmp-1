const express = require('express')
const { CONSTANT_VARIABLES } = require('../src/config/config')

const { expressApp } = require('../src/express-app')
const app = express();

require('../src/database/connection')
const startServer = () => {
    expressApp(app)

    app.listen(CONSTANT_VARIABLES.PORT, () => {
        console.log("Server is up and running");
    })
}

startServer()

module.exports = app 