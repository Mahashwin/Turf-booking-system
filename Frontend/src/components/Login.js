import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [captchaId, setCaptchaId] = useState("");
  const [captchaResponse, setCaptchaResponse] = useState("");
  const [captchaValue, setCaptchaValue] = useState("");
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // "Remember Me" state
  const navigate = useNavigate();

  // Styles (CSS-in-JS)
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundImage:
        "url('https://images.unsplash.com/photo-1473976345543-9ffc928e648d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHVyZiUyMHNwb3J0fGVufDB8fDB8fHww')",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
    },
    form: {
      backgroundColor: "#fff",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      width: "100%",
      maxWidth: "400px",
      zIndex: 1, // Ensure the card stays on top of the background
    },
    title: {
      textAlign: "center",
      fontSize: "24px",
      marginBottom: "20px",
    },
    input: {
      width: "100%",
      padding: "10px",
      margin: "10px 0",
      border: "1px solid #ccc",
      borderRadius: "4px",
      fontSize: "16px",
    },
    button: {
      backgroundColor: "#3182ce",
      color: "white",
      padding: "10px 20px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "background-color 0.3s",
      width: "100%",
      fontSize: "16px",
    },
    buttonHover: {
      backgroundColor: "#4c51bf", // Change background color on hover
    },
    label: {
      fontSize: "16px",
      fontWeight: "bold",
    },
    error: {
      color: "red",
      fontSize: "14px",
      marginBottom: "10px",
    },
    captchaContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "10px",
    },
    captchaText: {
      fontSize: "16px",
    },
    checkbox: {
      marginRight: "10px",
    },
  };

  // Generate CAPTCHA
  const generateCaptcha = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users/generate-captcha");
      setCaptchaId(response.data.captchaId);
      setCaptchaValue(response.data.captchaValue);
    } catch (err) {
      console.error("Error generating CAPTCHA:", err);
      setError("Error generating CAPTCHA");
    }
  };

  // Load saved credentials
  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    const savedContact = localStorage.getItem("contact");
    const savedRememberMe = localStorage.getItem("rememberMe");

    if (savedRememberMe === "true") {
      setEmail(savedEmail || "");
      setContact(savedContact || "");
      setRememberMe(true);
    }
  }, []);

  // Handle OTP submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !contact || !captchaId || !captchaResponse) {
      setError("Please fill in all fields.");
      return;
    }

    if (rememberMe) {
      localStorage.setItem("email", email);
      localStorage.setItem("contact", contact);
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("email");
      localStorage.removeItem("contact");
      localStorage.setItem("rememberMe", "false");
    }

    try {
      await axios.post("http://localhost:5000/api/users/generate-otp", {
        email,
        contact,
        captchaId,
        captchaResponse,
      });
      alert("OTP sent to your email!");
      setOtpSent(true);
      setError("");
    } catch (err) {
      console.error("Error generating OTP:", err);
      setError(err.response?.data?.message || "Error generating OTP");
    }
  };

  // Handle OTP verification
  const handleOtpVerify = async (e) => {
    e.preventDefault();

    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/users/verify-otp", {
        email,
        otp,
      });

      if (response.data.success) {
        setIsOtpVerified(true);
        setError("");
        alert("OTP verified successfully!");

        // Save token to localStorage
        localStorage.setItem("token", response.data.token);
        navigate("/booking"); // Redirect to the booking page
      } else {
        setError("Invalid OTP, please try again.");
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setError("Invalid OTP, please try again.");
    }
  };

  // Generate CAPTCHA on load
  useEffect(() => {
    generateCaptcha();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.form}>
        <h1 style={styles.title}>User Login/Register</h1>
        {error && <p style={styles.error}>{error}</p>}

        {otpSent && !isOtpVerified && (
          <form onSubmit={handleOtpVerify}>
            <h2>OTP Verification</h2>
            <div>
              <label style={styles.label}>Enter OTP *</label>
              <input
                style={styles.input}
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                placeholder="Enter OTP sent to your email"
              />
            </div>
            <div>
              <button
                type="submit"
                style={{ ...styles.button, ...styles.buttonHover }}
              >
                Verify OTP
              </button>
            </div>
          </form>
        )}

        {!otpSent && !isOtpVerified && (
          <form onSubmit={handleSubmit}>
            <div>
              <label style={styles.label}>Email *</label>
              <input
                style={styles.input}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={styles.label}>Contact *</label>
              <input
                style={styles.input}
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
                placeholder="Enter your contact number"
              />
            </div>

            <div style={styles.captchaContainer}>
              <label style={styles.label}>CAPTCHA *</label>
              <button type="button" onClick={generateCaptcha}>
                Refresh CAPTCHA
              </button>
              <span style={styles.captchaText}>
                {captchaValue ? `CAPTCHA: ${captchaValue}` : "Loading CAPTCHA..."}
              </span>
            </div>
            <input
              style={styles.input}
              type="text"
              value={captchaResponse}
              onChange={(e) => setCaptchaResponse(e.target.value)}
              required
              placeholder="Enter CAPTCHA"
            />

            <div>
              <label>
                <input
                  style={styles.checkbox}
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember Me
              </label>
            </div>

            <div>
              <button
                type="submit"
                style={{ ...styles.button, ...styles.buttonHover }}
              >
                Send OTP
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;
