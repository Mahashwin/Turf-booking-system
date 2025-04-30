const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    slots: { type: [String], required: true },
    user: { type: String, required: true },
    paymentId: { type: String, required: true }, // Store payment ID for tracking
  },
  { timestamps: true }
);

// Static method to get all booked slots for a specific date
bookingSchema.statics.getBookedSlotsByDate = async function (date) {
  const bookings = await this.find({ date });
  let bookedSlots = [];
  bookings.forEach((booking) => {
    bookedSlots = [...bookedSlots, ...booking.slots];
  });
  return bookedSlots;
};

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
