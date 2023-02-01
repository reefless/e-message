const express = require("express");

// Controllers
const {
	create,
	verifyEmail,
	resendEmailVerificationToken,
	forgetPassword,
	sendResetpasswordTokenStatus,
	resetPassword,
	signIn,
} = require("../controllers/user");
const { isValidPasswordResetToken } = require("../middlewares/user");

// MiddlewareStack
const {
	userValidator,
	validate,
	validatePassword,
	signInValidator,
} = require("../middlewares/validator");

const router = express.Router();

router.post("/create", userValidator, validate, create);
router.post("/sign-in", signInValidator, validate, signIn);
router.post("/verify-email", verifyEmail);
router.post("/resend-email-verification-token", resendEmailVerificationToken);
router.post("/forget-password", forgetPassword);
router.post(
	"/verify-password-reset-token",
	isValidPasswordResetToken,
	sendResetpasswordTokenStatus
);
router.post(
	"/reset-password",
	isValidPasswordResetToken,
	validate,
	validatePassword,
	resetPassword
);

module.exports = router;
