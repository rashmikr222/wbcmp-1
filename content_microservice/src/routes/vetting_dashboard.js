const express = require('express')
const routes = express.Router()

const vettingController = require('../controllers/vetting-controllers')
const { isVettingExist } = require('../middleware/isVettingExist')

routes.get('/vetting-order-dashboard', vettingController.getVettingDashboard)



module.exports = routes