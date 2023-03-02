const express = require("express");
const routes = express.Router();

const orderController = require("../controllers/order_controller");

// create order validations
// view order(order_info) based on custome id
const {
  createOrderSchema,
} = require("../middleware/validation/validation_schema/create_order_validation_schema");
const {
  createOrderValidation,
} = require("../middleware/validation/create_order_validation");
const {
  isOrderIdUnique,
} = require("../middleware/validation/order_id_validation");

// get order validations
const {
  getOrderSchema,
} = require("../middleware/validation/validation_schema/get_order_schema");
const {
  getOrderValidate,
} = require("../middleware/validation/get_order_validation");
const {
  isValidOrderId,
} = require("../middleware/validation/get_order_id_validation");

routes.get("/get-masterData", orderController.getMasterData);
// routes.post(
//   "/create-order",
//   createOrderValidation(createOrderSchema),
//   isOrderIdUnique,
//   orderController.createOrder
// );
routes.post(
  "/create-order-projectname",
  createOrderValidation(createOrderSchema),
  isOrderIdUnique,
  orderController.createOrderProjectname
);

routes.post(
  "/create-order-requirement/:id",
  //   createOrderRequirementValidation(createOrderSchema),
  //   isOrderIdUnique,
  orderController.createOrderRequirement
);
// routes.get('/get-orders/:id', getOrderValidate(getOrderSchema), isValidOrderId, orderController.getOrder)
routes.get("/get-orders/:orderId", isValidOrderId, orderController.getOrder);


// Enter Your Project Details
routes.put('/update-order-details/:order_id', orderController.updateOrderDetails)
routes.get('/get-order-details/:order_id', orderController.getOrderDetails)
// 
routes.post('/create-order-images/:order_id', orderController.createOrderImage)
module.exports = routes;
