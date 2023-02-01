const crypto = require("crypto");
exports.sendError = (res, error, statusCode = 401) => {
	return res.status(statusCode).json({ error });
};

exports.generateRandomBytes = () => {
	return new Promise((resolve, reject) => {
		crypto.randomBytes(30, (err, buff) => {
			if (err) reject(err);
			const bufferString = buff.toString("hex");
			console.log(bufferString);
			resolve(bufferString);
		});
	});
};
