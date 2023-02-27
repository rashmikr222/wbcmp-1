const express = require('express')
const proxy = require('express-http-proxy')

const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('swagger.yaml')

const { CONSTANT_VARIABLES } = require('./config')

const app = express()

app.use(express.json());

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

app.use('/order', proxy('http://localhost:8002'))

app.listen(CONSTANT_VARIABLES.PORT, () => {
    console.log("server is up and running");
})