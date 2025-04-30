// routes/feedbackRoutes.js
const express = require("express");
const Feedback = require("../models/Feedback"); // Corrected path

const router = express.Router();

// POST: Submit feedback
router.post("/", async (req, res) => {
  const { name, subject, message } = req.body;

  if (!name || !subject || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newFeedback = new Feedback({ name, subject, message });
    await newFeedback.save();
    res.status(201).json({ message: "Feedback submitted successfully!" });
  } catch (error) {
    console.error("Error saving feedback:", error);
    res.status(500).json({ message: "Error submitting feedback" });
  }
});

module.exports = router;
