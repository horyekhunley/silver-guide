const express = require("express");
const auth_controller = require("../controllers/auth_controller");

const router = express.Router();

router.route("/auth/signin").post(auth_controller.signin);

router.route("/auth/signout").get(auth_controller.signout);

module.exports = router;