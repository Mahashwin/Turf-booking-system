const express = require("express");
const Booking = require("../models/Booking");
const router = express.Router();

// Handle the booking request
router.post("/", async (req, res) => {
  const { date, slots, user, paymentId } = req.body;

  if (!date || !slots || !user || !paymentId) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if any of the selected slots are already booked
    const bookedSlots = await Booking.getBookedSlotsByDate(date);

    const conflictingSlots = slots.filter((slot) => bookedSlots.includes(slot));
    if (conflictingSlots.length > 0) {
      return res.status(400).json({
        error: `The following slots are already booked: ${conflictingSlots.join(", ")}`,
      });
    }

    // Save the booking
    const newBooking = new Booking({
      date,
      slots,
      user,
      paymentId, // Include the payment ID for tracking
    });

    const savedBooking = await newBooking.save();
    res.status(201).json({ message: "Booking successful", booking: savedBooking });
  } catch (error) {
    console.error("Error saving booking:", error);
    res.status(500).json({ error: "Failed to book slots. Please try again later." });
  }
});

// Get already booked slots for a specific date
router.get("/booked-slots", async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ error: "Date is required" });
  }

  try {
    const bookedSlots = await Booking.getBookedSlotsByDate(date);
    res.status(200).json({ bookedSlots });
  } catch (error) {
    console.error("Error fetching booked slots:", error);
    res.status(500).json({ error: "Failed to fetch booked slots. Please try again later." });
  }
});

module.exports = router;
