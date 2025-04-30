import React, { useState } from "react";
import axios from "axios";

const Feedback = () => {
  const [feedback, setFeedback] = useState({ name: "", subject: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/Feedback", feedback);
      alert(response.data.message);
      setFeedback({ name: "", subject: "", message: "" }); // Reset form
    } catch (error) {
      alert("Failed to submit feedback. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Feedback</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          value={feedback.name}
          onChange={(e) => setFeedback({ ...feedback, name: e.target.value })}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px" }}
        />
        <input
          type="text"
          placeholder="Subject"
          value={feedback.subject}
          onChange={(e) => setFeedback({ ...feedback, subject: e.target.value })}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px" }}
        />
        <textarea
          placeholder="Message"
          value={feedback.message}
          onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px", height: "100px", borderRadius: "5px" }}
        />
        <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "#4500c7", color: "white", borderRadius: "5px" }}>
          Send Feedback
        </button>
      </form>
    </div>
  );
};

export default Feedback;
