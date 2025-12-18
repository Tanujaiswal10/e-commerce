const express = require("express");
const router = express.Router();

const inventoryController = require('../controller/inventoryController');
const auth = require("../middleware/authMiddleware");

router.post("/create", auth, inventoryController.createProduct);
router.get("/getAllProduct", inventoryController.getAllProducts);
router.get("/getProduct/:id", inventoryController.getProductById);

module.exports = router;
