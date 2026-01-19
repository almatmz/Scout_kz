const express = require("express");
const authController = require("../controllers/auth.controller");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.post("/register", authController.register.bind(authController));
router.post("/login", authController.login.bind(authController));
router.get("/me", auth, authController.getMe.bind(authController));
router.put("/profile", auth, authController.updateProfile.bind(authController));

module.exports = router;
