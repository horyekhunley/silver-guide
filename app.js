const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const compress = require("compression");
const cors = require("compression");
const helmet = require("helmet");
const ip = require("ip");
require("dotenv").config();

const userRoutes = require("./routes/user_routes");
const authRoutes = require("./routes/auth_routes");

const app = express();

//database connection
mongoose
	.connect(process.env.MONGOOSE_URI)
	.then(() => {
		console.log("MongoDB connected...");
	})
	.catch((err) => {
		console.log("MongoDB conection error", err);
		process.exit;
	});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors());

app.use("/", userRoutes);
app.use("/auth", authRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Server running on port ${ip.address()}:${port}`);
});
