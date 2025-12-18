const express = require("express");
const router = express.Router();

const orderController = require("../controller/orderController");
const auth = require("../middleware/authMiddleware");

router.post("/create", auth, orderController.createOrder);
router.get("/getOrder/:orderId", auth, orderController.getOrderById);
router.get("/getAllOrder", auth, orderController.getOrders);
router.patch("/cancel/:orderId", auth, orderController.cancelOrder);

module.exports = router;
