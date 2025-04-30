const express = require("express");
const { sendOtp, generateCaptchaHandler, validateCaptchaHandler, verifyOtp } = require("../controllers/userController");

const router = express.Router();

// Generate CAPTCHA - GET request
router.get("/generate-captcha", generateCaptchaHandler);

// Validate CAPTCHA - POST request
router.post("/validate-captcha", validateCaptchaHandler);

// Generate OTP after CAPTCHA validation - POST request
router.post("/generate-otp", sendOtp);

// Verify OTP - POST request
router.post("/verify-otp", verifyOtp); // <-- Added this route for OTP verification

module.exports = router;