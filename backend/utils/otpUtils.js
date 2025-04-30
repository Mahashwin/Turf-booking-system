const twilio = require("twilio");

const accountSid = "#"; // Your Twilio Account SID
const authToken = "#"; // Your Twilio Auth Token
// const client = twilio(accountSid, authToken);

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Ensure the phone number is in E.164 format
const formatPhoneNumber = (phone) => {
  if (!phone.startsWith('+')) {
    // If the number doesn't start with '+', prepend with the country code (e.g., +91 for India)
    // You should replace this with the correct country code based on your requirements.
    phone = `+91${phone}`;  // For India, use +91. Replace with your country code if necessary.
  }
  return phone;
};

// Send OTP to the specified phone number
const sendOTP = (phone, otp) => {
  const formattedPhone = formatPhoneNumber(phone);  // Ensure the phone number is in the correct format
  
  const fromNumber = "+919942621479";  // Twilio phone number in E.164 format (+<CountryCode><PhoneNumber>)
  // Example: If sending to India, use a Twilio number that supports SMS to India (i.e., starting with +91).
  
  client.messages
    .create({
      body: `Your OTP is: ${otp}`,
      from: fromNumber, // Replace with your valid Twilio phone number in E.164 format
      to: formattedPhone,  // The phone number must be in E.164 format (e.g., +91994262XXXX)
    })
    .then((message) => console.log(`OTP sent successfully: ${message.sid}`))
    .catch((error) => {
      console.error("Error sending OTP:", error);
      throw new Error("Error sending OTP");
    });
};

module.exports = { generateOTP, sendOTP };
