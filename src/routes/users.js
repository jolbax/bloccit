const express = require("express");
const router = express.Router();
const validation = require("./validation");

const userController = require("../controllers/userController");

router.get("/users/sign_up", userController.signUp);
router.post("/users", validation.userChecks, validation.validateForm, userController.create);
router.get("/users/sign_in", userController.singInForm);
router.post("/users/sign_in", validation.userChecks, validation.validateForm, userController.signIn);
router.get("/users/sign_out", userController.signOut);

module.exports = router;