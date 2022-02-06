const express = require("express");
const user_controller = require("../controllers/user_controller");
const auth_controller = require("../controllers/auth_controller");

const router = express.Router();
router
	.route("/api/users")
	.get(user_controller.list)
	.post(user_controller.create);
router
	.route("/api/users/:userId")
	.get(auth_controller.requireSignin, user_controller.read)
	.put(
		auth_controller.requireSignin,
		auth_controller.isAuthorised,
		user_controller.update
	)
	.delete(
		auth_controller.requireSignin,
		auth_controller.isAuthorised,
		user_controller.remove
	);

router.param("userId", user_controller.userByID);

module.exports = router;