const User = require("../models/user_model");
require("dotenv").config();
const jwt = require("jsonwebtoken");
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

exports.signin = async (req, res) => {
	try {
		let user = await User.findOne({ email: req.body.email });
		if (!user) {
			return res.status(HttpStatus.UNAUTHORIZED.code).json({
				status: HttpStatus.UNAUTHORIZED.status,
				message: "User not found",
			});
		}
		const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
		res.cookie("t", token, { expire: new Date() + 9999 });
		return res.json({
			token,
			user: { _id: user._id, name: user.name, email: user.email },
		});
	} catch (error) {
		res.status(HttpStatus.UNAUTHORIZED.code).json({
			status: HttpStatus.UNAUTHORIZED.status,
			message: error.message,
		});
	}
};

exports.signout = (req, res) => {
  res.clearCookie("t");
  return res.json({
    message: "Sign out",
  });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['RS256'],
  userProperty: "auth",
})
exports.isAuthorised = (req, res, next) => {
  const authorised = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!authorised) {
    return res.status(HttpStatus.FORBIDDEN.code).json({
      status: HttpStatus.FORBIDDEN.status,
      message: "User is not authorised",
    });
  } 
  next();
}