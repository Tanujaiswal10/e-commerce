const express = require("express");
const router = express.Router();

const user = require('./userRoute')
const inventory = require("./inventoryRoute")
const order = require("./orderRoute")

router.use("/user", user);
router.use("/inventory", inventory);
router.use("/order", order);


module.exports = router;
