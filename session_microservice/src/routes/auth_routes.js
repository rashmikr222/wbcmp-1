const express = require("express");
const router = express.Router();

const userController = require("../controllers/auth_controller");
// auth middleware

const { jwtCheck } = require("../middleware/auth0_middleware");


const { createUserSchema, userLoginSchema, userForgotPasswordSchema } = require('../validations/schema/userSchema')
const { createUserValidation, userLoginValidation, userForgotPasswordValidation } = require('../validations/userValidation')

router.post('/signup', createUserValidation(createUserSchema), userController.userSignup)
router.post('/login', userLoginValidation(userLoginSchema), userController.userLogin)
router.post('/forgotPassword', userForgotPasswordValidation(userForgotPasswordSchema), userController.forgotPassword)
// api to store user
router.get(
  "/fetch-userInformation",
  jwtCheck,
  userController.getUserInformation
);
router.put("/logout/:id", userController.userLogout);

// router.get('/userinformation/:id',userController.getUser)

router.get("/protectedRoute", jwtCheck, userController.testapi);
router.get("/routeWithoutToken", userController.testSession);

module.exports = router;
