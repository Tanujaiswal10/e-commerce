const express = require("express");
const router = express.Router();

const userController = require("../controller/userController");
const auth = require("../middleware/authMiddleware");

router.post("/create", userController.create);
router.post("/login", userController.login);
router.get("/getUser/:id", auth, userController.getUserById);
router.get("/getAllUser", auth, userController.getAllUsers);

module.exports = router;
