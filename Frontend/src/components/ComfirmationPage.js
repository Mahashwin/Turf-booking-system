import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedDate, selectedSlots, totalAmount } = location.state || {};
  
  const [isHovered, setIsHovered] = useState(false); // For button hover effect

  const handlePaymentRedirect = () => {
    const options = {
      key: "rzp_test_jIQCJvOHpFzZJx", // Replace with your Razorpay key
      amount: totalAmount * 100, // Amount is in paise, so multiply by 100
      currency: "INR",
      name: "Booking Payment",
      description: `Payment for slots on ${selectedDate?.toDateString()}`,
      handler: async function (response) {
        alert("Payment successful! Payment ID: " + response.razorpay_payment_id);

        // Check if the user is logged in after payment
        const token = localStorage.getItem("token");
        if (!token) {
          alert("You need to log in first!");
          navigate("/login");
          return;
        }

        // Proceed with booking the slots after payment
        try {
          const bookingData = {
            date: selectedDate.toDateString(),
            slots: selectedSlots,
            user: "user@example.com", // Replace with actual user email
            paymentId: response.razorpay_payment_id, // Include payment ID for tracking
          };

          const bookingResponse = await axios.post("http://localhost:5000/api/bookings", bookingData, {
            headers: {
              Authorization: `Bearer ${token}`, // Include the auth token
            },
          });

          if (bookingResponse.status === 200) {
            alert("Booking confirmed successfully!");
            navigate("/booking"); // Redirect to the booking page
          } else {
            alert("confirmed the booking");
            navigate("/booking");
          }
        } catch (error) {
          console.error("Error booking slots after payment:", error);
          alert("An error occurred while booking slots. Please try again.");
        }
      },
      prefill: {
        name: "Mahashwin V", // User's name
        email: "mahashwinv.22cse@kongu.edu", // User's email
        contact: "1234567890", // User's contact number
      },
      notes: {
        address: "Some address",
      },
      theme: {
        color: "#F37254", // Payment gateway theme color
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Booking Confirmation</h2>
      <p style={styles.details}>Date: {selectedDate?.toDateString()}</p>
      <p style={styles.details}>Slots: {selectedSlots.join(", ")}</p>
      <p style={styles.details}>Total Amount: ₹{totalAmount}</p>

      <button
        onClick={handlePaymentRedirect}
        style={isHovered ? { ...styles.button, ...styles.buttonHover } : styles.button}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        Confirm Booking & Pay
      </button>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#f9f9f9",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "80%",
    maxWidth: "600px",
    margin: "40px auto",
    fontFamily: "'Roboto', sans-serif",
    textAlign: "center",
  },
  heading: {
    fontSize: "2em",
    color: "#333",
    marginBottom: "20px",
    fontWeight: "bold",
  },
  details: {
    fontSize: "1.1em",
    color: "#555",
    marginBottom: "20px",
    lineHeight: "1.5",
  },
  button: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "14px 30px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    borderRadius: "8px",
    transition: "background-color 0.3s, transform 0.3s",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  buttonHover: {
    backgroundColor: "#45a049",
    transform: "scale(1.05)",
  },
};

export default ConfirmationPage;
