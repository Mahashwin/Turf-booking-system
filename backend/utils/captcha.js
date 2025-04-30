const crypto = require("crypto");

const captchas = new Map(); // Temporarily store captchas

// Generate a random CAPTCHA
const generateCaptcha = () => {
  const captchaValue = crypto.randomBytes(3).toString("hex"); // Random 6-character CAPTCHA
  const captchaId = crypto.randomUUID(); // Unique ID for CAPTCHA
  captchas.set(captchaId, captchaValue); // Store CAPTCHA in memory
  setTimeout(() => captchas.delete(captchaId), 300000); // Auto-delete after 5 minutes
  return { captchaId, captchaValue };
};

// Verify CAPTCHA
const verifyCaptcha = (captchaId, captchaResponse) => {
  const storedCaptcha = captchas.get(captchaId);
  if (!storedCaptcha) return false; // Invalid or expired CAPTCHA
  return storedCaptcha === captchaResponse;
};

module.exports = { generateCaptcha, verifyCaptcha };
