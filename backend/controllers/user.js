const User = require("../models/user");
const EmailVerificationToken = require("../models/emailVerificationToken");
const crypto = require("crypto");
const { isValidObjectId } = require("mongoose");
const { generateOTP, generateMailTransporter } = require("../utils/mail");
const PasswordResetToken = require("../models/passwordResetToken");
const { generateRandomBytes, sendError } = require("../utils/helper");
const jwt = require("jsonwebtoken");

exports.create = async (req, res) => {
	const { name, email, password } = req.body;
	const oldUser = await User.findOne({ email });

	if (oldUser) return sendError(res, "This email already exists");

	const newUser = new User({ name, email, password });
	await newUser.save();

	// generate 6 digit OTP
	let OTP = generateOTP();

	// store OTP inside our db
	const newEmailVerificationToken = new EmailVerificationToken({
		owner: newUser._id,
		token: OTP,
	});
	await newEmailVerificationToken.save();

	// send that OTP to our user
	const transport = generateMailTransporter();

	transport.sendMail({
		from: "verification@ourapp.com",
		to: newUser.email,
		subject: "OTP Email Verification",
		html: `
			<p>Your verification OTP </p>
			<h1>${OTP}</h1>
		`,
	});

	res.status(201).json({
		message:
			"Please verify your email. OTP has been sent to your email account!",
	});
};

exports.verifyEmail = async (req, res) => {
	const { userId, OTP } = req.body;

	if (!isValidObjectId(userId)) return sendError(res, "Invalid user ID.");

	const user = await User.findById(userId);
	if (!user) return sendError(res, "User not found", 404);

	if (user.isVerified) return sendError(res, "User is already verified");

	const token = await EmailVerificationToken.findOne({ owner: userId });
	if (!token) return sendError(res, "Token not found");

	const isMatched = await token.compareToken(OTP);
	if (!isMatched) return sendError(res, "OTP does not match");

	user.isVerified = true;
	await user.save();

	await EmailVerificationToken.findByIdAndDelete(token._id);

	const transport = generateMailTransporter();

	transport.sendMail({
		from: "verification@ourapp.com",
		to: user.email,
		subject: "Welcome Email",
		html: "<h1>Welcome to our app </h1>",
	});
	res.json({ message: "Your email has been verified" });
};

exports.resendEmailVerificationToken = async (req, res) => {
	const { userId } = req.body;

	const user = await User.findById(userId);
	if (!user) return sendError(res, "User not found");

	if (user.isVerified) return sendError(res, "This email is already verified");

	const alreadyHasToken = await EmailVerificationToken.findOne({
		owner: userId,
	});

	if (alreadyHasToken) return;
	sendError(res, "Only after one hour you can request for another token");
	// generate 6 digit OTP
	let OTP = generateOTP();

	// store OTP inside our db
	const newEmailVerificationToken = new EmailVerificationToken({
		owner: user._id,
		token: OTP,
	});
	await newEmailVerificationToken.save();

	// send that OTP to our user
	const transport = generateMailTransporter();

	transport.sendMail({
		from: "verification@ourapp.com",
		to: user.email,
		subject: "OTP Email Verification",
		html: `
			<p>Your verification OTP </p>
			<h1>${OTP}</h1>
		`,
	});

	res.status(201).json({
		message: "New OTP has been sent to your registered email account.",
	});
};

exports.forgetPassword = async (req, res) => {
	const { email } = req.body;

	if (!email) return sendError(res, "Email is required");
	const user = await User.findOne({ email });
	if (!user) return sendError(res, "User not found", 404);

	const alreadyHasToken = await PasswordResetToken.findOne({ owner: user._id });
	if (alreadyHasToken)
		return sendError(
			res,
			"Only after one hour you can request for another token!"
		);

	const token = await generateRandomBytes();
	const newPasswordResetToken = await PasswordResetToken({
		owner: user._id,
		token: token,
	});

	await newPasswordResetToken.save();

	const resetPasswordUrl = `https://localhost:3000/reset-password?token=${token}&id=${user._id}`;

	const transport = generateMailTransporter();

	transport.sendMail({
		from: "security@ourapp.com",
		to: user.email,
		subject: "Reset password Link",
		html: `
			<p>Click here to reset password </p>
			<a href='${resetPasswordUrl}'>Change Password</a>
		`,
	});

	res.status(201).json({
		message: "Link sent to your email.",
	});
};

exports.sendResetpasswordTokenStatus = (req, res) => {
	res.json({ valid: true });
};

exports.resetPassword = async (req, res) => {
	const { newPassword, userId } = req.body;

	const user = await User.findById(userId);
	const passwordMatched = await user.comparePassword(newPassword);
	if (passwordMatched)
		return sendError(
			res,
			"The new password must be different from the old password"
		);

	user.password = newPassword;
	await user.save();

	await PasswordResetToken.findByIdAndDelete(req.resetToken._id);
	var transport = generateMailTransporter();

	transport.sendMail({
		from: "security@ourapp.com",
		to: user.email,
		subject: "Password Reset Successfully",
		html: `
			<h1>Password Reset Successfully </h1>
		`,
	});

	res.json({
		message: "Password reset successfully, now you can use new password",
	});
};

exports.signIn = async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });
	if (!user) return sendError(res, "Email/Password mismatch");

	const passwordMatched = await user.comparePassword(password);
	if (!passwordMatched) return sendError(res, "Email/Password mismatch");

	const { _id, name } = user;

	const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
	res.json({ user: { id: _id, name, email, token: jwtToken } });
};
