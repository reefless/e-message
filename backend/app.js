const express = require("express");
const { errorHandler } = require("./middlewares/error");
const userRouter = require("./routes/user");
require("dotenv").config();
require("./db");
require("express-async-errors");

const app = express();
app.use(express.json());
app.use("/api/user", userRouter);

app.use(errorHandler);

app.get(
	"/about",
	() => {},
	(req, res) => {
		res.send("Hello I am");
	}
);

app.listen(8000, () => {
	console.log("listening on port 8000");
});
