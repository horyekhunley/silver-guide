const User = require("../models/user_model");
const expressJwt = require("express-jwt");

const HttpStatus = {
	OK: { code: 200, status: "OK" },
	CREATED: { code: 201, status: "Created" },
	NO_CONTENT: { code: 204, status: "No Content" },
	BAD_REQUEST: { code: 400, status: "Bad Request" },
	UNAUTHORIZED: { code: 401, status: "Unauthorized" },
	FORBIDDEN: { code: 403, status: "Forbidden" },
	NOT_FOUND: { code: 404, status: "Not found" },
	CONFLICT: { code: 409, status: "Conflict" },
	INTERNAL_SERVER_ERROR: { code: 500, status: "Internal Server Error" },
};

exports.create = async(req, res, next) => {
	const user = new User(req.body);
	try {
		await user.save();
		res.status(HttpStatus.CREATED.code).json({
			message: HttpStatus.CREATED.status,
			user,
			message: "User created successfully",
		});
	} catch (err) {
		res.status(HttpStatus.BAD_REQUEST.code).json({
			status: HttpStatus.BAD_REQUEST.status,
			message: err.message,
		});
	}
};

exports.list = async (req, res, next) => {
	try {
		let users = await User.find().select("name email updated created");
	} catch (err) {
		return res.status(HttpStatus.BAD_REQUEST.code).json({
			status: HttpStatus.BAD_REQUEST.status,
			message: err.message,
		});
	}
};
exports.read = (req, res, next) => {
	req.profile.hashed_password = undefined;
	req.profile.salt = undefined;
	return res.json(req.profile);
};
exports.update = async(req, res, next) => {
	try {
		let user = req.profile;
		user = extend(user, req.body);
		user.updated = Date.now();
		await user.save();
		user.hashed_password = undefined;
		user.salt = undefined;
		res.json(user);
	} catch (err) {
		return res.status(HttpStatus.BAD_REQUEST.code).json({
			status: HttpStatus.BAD_REQUEST.status,
			message: err.message,
		});
	}
};

exports.userByID = (req, res, next, id) => {
	try {
		let user = User.findById(id);
		if (!user) {
			return res.status(HttpStatus.NOT_FOUND.code).json({
				status: HttpStatus.NOT_FOUND.status,
				message: "User not found",
			});
		}
	} catch (err) {
		return res.status(HttpStatus.BAD_REQUEST.code).json({
			status: HttpStatus.BAD_REQUEST.status,
			message: "Could not find user",
		});
	}
};

exports.remove = async (req, res, next) => {
	try {
		let user = req.profile;
		let deletedUser = await user.remove();
		deletedUser.hashed_password = undefined;
		deletedUser.salt = undefined;
		res.json(deletedUser);
	} catch (err) {
		return res.status(HttpStatus.BAD_REQUEST.code).json({
			status: HttpStatus.BAD_REQUEST.status,
			message: err.message,
		});
	}
};
