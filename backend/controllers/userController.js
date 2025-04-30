const { generateOTP } = require("../utils/otpUtils");
const { generateCaptcha, verifyCaptcha } = require("../utils/captcha");
const nodemailer = require("nodemailer");

const otpStore = {}; // Temporary store for OTPs (use a database in production)

// Generate OTP after CAPTCHA validation
const sendOtp = async (req, res) => {
  const { email, captchaId, captchaResponse } = req.body;

  // Validate CAPTCHA
  const isCaptchaValid = verifyCaptcha(captchaId, captchaResponse);
  if (!isCaptchaValid) {
    return res.status(400).json({ success: false, message: "Invalid CAPTCHA" });
  }

  const otp = generateOTP(); // Generate OTP

  try {
    // Send OTP via email
    await sendOTPEmail(email, otp);

    // Store OTP in memory (with expiration time)
    otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // 5 minutes

    return res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ success: false, message: "Error sending OTP" });
  }
};

// OTP verification
const verifyOtp = (req, res) => {
  const { email, otp } = req.body;

  const otpData = otpStore[email];
  if (!otpData) {
    return res.status(400).json({ success: false, message: "OTP has expired or was never sent" });
  }

  if (otp === otpData.otp && Date.now() < otpData.expiresAt) {
    delete otpStore[email]; // Clear OTP after successful verification
    return res.status(200).json({ success: true, message: "OTP verified successfully" });
  }

  return res.status(400).json({ success: false, message: "Invalid OTP" });
};

// Send OTP via email
const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

// Generate CAPTCHA
const generateCaptchaHandler = (req, res) => {
  try {
    const captcha = generateCaptcha();
    res.status(200).json(captcha);
  } catch (error) {
    console.error("Error generating CAPTCHA:", error);
    res.status(500).json({ message: "Failed to generate CAPTCHA" });
  }
};

// Validate CAPTCHA
const validateCaptchaHandler = (req, res) => {
  const { captchaId, captchaResponse } = req.body;
  const isValid = verifyCaptcha(captchaId, captchaResponse);

  if (isValid) {
    res.status(200).json({ success: true });
  } else {
    res.status(400).json({ success: false, message: "Invalid CAPTCHA" });
  }
};

module.exports = {
  sendOtp,
  generateCaptchaHandler,
  validateCaptchaHandler,
  verifyOtp,
};