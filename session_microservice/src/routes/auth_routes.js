const express = require('express')
const router = express.Router()

const userController = require('../controllers/auth_controller')
// auth middleware

const { jwtCheck } = require('../middleware/auth0_middleware')


// api to store user
router.get('/fetch-userInformation', jwtCheck, userController.getUserInformation)
router.put('/logout/:id', userController.userLogout)

router.get('/userinformation/:id',userController.getUser)

router.get("/protectedRoute", jwtCheck, userController.testapi)
router.get("/routeWithoutToken", userController.testSession)



module.exports = router