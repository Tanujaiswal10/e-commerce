const express = require("express");
const router = express.Router();

const user = require('./userRoute')
const inventory = require("./inventoryRoute")

router.use("/user", user);
router.use("/inventory", inventory);


module.exports = router;
