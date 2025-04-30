import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BookingPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const navigate = useNavigate();
  const adminPhoneNumber = "+91-123456789";

  const getDatesForRange = (date, range) => {
    const dates = [];
    for (let i = -range; i <= range; i++) {
      const newDate = new Date(date);
      newDate.setDate(date.getDate() + i);
      dates.push(newDate);
    }
    return dates;
  };

  const dates = getDatesForRange(currentDate, 2);

  const [slots] = useState({
    EarlyMorning: ["12 to 1 AM", "1 to 2 AM", "2 to 3 AM", "3 to 4 AM", "4 to 5 AM", "5 to 6 AM"],
    Morning: ["6 to 7 AM", "7 to 8 AM", "8 to 9 AM", "9 to 10 AM", "10 to 11 AM", "11 to 12 AM"],
    Afternoon: ["12 to 1 PM", "1 to 2 PM", "2 to 3 PM", "3 to 4 PM"],
    Evening: ["4 to 5 PM", "5 to 6 PM", "6 to 7 PM", "7 to 8 PM"],
    Night: ["8 to 9 PM", "9 to 10 PM", "10 to 11 PM", "11 to 12 AM"],
  });

  const [prices] = useState({
    discounted: 450,
    original: 600,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to log in first!");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!selectedDate) return;
      try {
        const response = await axios.get(`http://localhost:5000/api/bookings/booked-slots`, {
          params: { date: selectedDate.toDateString() },
        });
        setBookedSlots(response.data.bookedSlots);
      } catch (error) {
        console.error("Error fetching booked slots:", error);
      }
    };

    fetchBookedSlots();
  }, [selectedDate]);

  const handleSlotSelection = (slot) => {
    setSelectedSlots((prevSelectedSlots) => {
      if (prevSelectedSlots.includes(slot)) {
        return prevSelectedSlots.filter((s) => s !== slot);
      } else if (prevSelectedSlots.length < 3) {
        return [...prevSelectedSlots, slot];
      } else {
        alert(`You can't select more than 3 slots per day. Please contact the admin at ${adminPhoneNumber} for further assistance.`);
        return prevSelectedSlots;
      }
    });
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setSelectedSlots([]);
  };

  const handlePrevClick = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 5);
    setCurrentDate(newDate);
    setSelectedDate(null);
    setSelectedSlots([]);
  };

  const handleNextClick = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 5);
    setCurrentDate(newDate);
    setSelectedDate(null);
    setSelectedSlots([]);
  };

  const handleProceedToPayment = () => {
    if (!selectedDate || selectedSlots.length === 0) {
      alert("Please select a date and at least one slot before proceeding.");
      return;
    }

    const totalAmount = selectedSlots.length * prices.discounted;

    // Redirect to the payment page
    navigate("/confirmation", {
      state: {
        selectedDate,
        selectedSlots,
        totalAmount,
      },
    });
  };

  const isSlotInPast = (timeSlot, date) => {
    const now = new Date();
    const slotDate = new Date(date);
    const [startTime, endTime] = timeSlot.split(" to ");
    const [startHour, startMinute] = startTime.split(" ");
    const [endHour, endMinute] = endTime.split(" ");
    let startHour24 = parseInt(startHour);
    if (startMinute === "PM" && startHour < 12) startHour24 += 12;
    if (startMinute === "AM" && startHour === 12) startHour24 = 0;

    let endHour24 = parseInt(endHour);
    if (endMinute === "PM" && endHour < 12) endHour24 += 12;
    if (endMinute === "AM" && endHour === 12) endHour24 = 0;

    slotDate.setHours(startHour24, 0, 0, 0);
    return now > slotDate;
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Book Your Slot</h1>

      <div style={styles.dateSelector}>
        <button style={styles.arrowButton} onClick={handlePrevClick}>
          &lt;
        </button>
        {dates.map((date, index) => (
          <div
            key={index}
            style={{
              ...styles.dateBox,
              backgroundColor: selectedDate?.toDateString() === date.toDateString() ? "#5a67d8" : "#fff",
              color: selectedDate?.toDateString() === date.toDateString() ? "#fff" : "#333",
            }}
            onClick={() => handleDayClick(date)}
          >
            <p style={styles.dateText}>{date.getDate()}</p>
            <p style={styles.dayText}>{date.toLocaleString("default", { weekday: "short" }).toUpperCase()}</p>
            <p style={styles.monthText}>{date.toLocaleString("default", { month: "short" }).toUpperCase()}</p>
          </div>
        ))}
        <button style={styles.arrowButton} onClick={handleNextClick}>
          &gt;
        </button>
      </div>

      {Object.entries(slots).map(([period, timeSlots]) => (
        <div key={period}>
          <h3 style={styles.sectionTitle}>{period}</h3>
          <div style={styles.slotGrid}>
            {timeSlots.map((time, index) => {
              const isSlotBooked = bookedSlots.includes(time);
              const isSelected = selectedSlots.includes(time);
              const isPast = isSlotInPast(time, selectedDate);
              return (
                <div
                  key={index}
                  style={{
                    ...styles.slotBox,
                    ...(isSelected && styles.selectedSlot),
                    pointerEvents: isSlotBooked || isPast ? "none" : "auto",
                    opacity: isSlotBooked || isPast ? 0.5 : 1,
                  }}
                  onClick={() => !isSlotBooked && !isPast && handleSlotSelection(time)}
                >
                  <p style={styles.price}>
                    <span style={styles.originalPrice}>₹{prices.original}</span>
                    <span style={styles.discountedPrice}>₹{prices.discounted}</span>
                  </p>
                  <p style={styles.slotTime}>{time}</p>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {selectedDate && selectedSlots.length > 0 && (
        <div style={styles.bookButtonContainer}>
          <div style={styles.totalAmount}>Total: ₹{selectedSlots.length * prices.discounted}</div>
          <button style={styles.bookButton} onClick={handleProceedToPayment}>
            Proceed to Payment &gt;&gt;
          </button>
        </div>
      )}
    </div>
  );
};
const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#f4f4f4",
    fontFamily: "'Roboto', sans-serif",
  },
  header: {
    textAlign: "center",
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "30px",
    color: "#333",
  },
  dateSelector: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "30px",
  },
  arrowButton: {
    backgroundColor: "#5a67d8",
    color: "#fff",
    border: "none",
    padding: "10px",
    fontSize: "18px",
    cursor: "pointer",
  },
  dateBox: {
    width: "80px",
    padding: "10px",
    textAlign: "center",
    margin: "0 10px",
    cursor: "pointer",
    borderRadius: "8px",
    transition: "background-color 0.3s ease",
  },
  dateText: {
    fontSize: "20px",
    fontWeight: "bold",
  },
  dayText: {
    fontSize: "14px",
    fontWeight: "normal",
  },
  monthText: {
    fontSize: "12px",
    fontWeight: "normal",
  },
  sectionTitle: {
    fontSize: "24px",
    margin: "20px 0 10px",
    fontWeight: "600",
  },
  slotGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
  },
  slotBox: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "15px",
    cursor: "pointer",
    transition: "transform 0.2s ease, background-color 0.2s ease",
  },
  selectedSlot: {
    backgroundColor: "#5a67d8",
    color: "#fff",
  },
  price: {
    fontSize: "16px",
    marginBottom: "10px",
    color: "#666",
  },
  originalPrice: {
    textDecoration: "line-through",
    marginRight: "10px",
    color: "#999",
  },
  discountedPrice: {
    fontWeight: "bold",
    color: "#5a67d8",
  },
  slotTime: {
    fontSize: "16px",
    fontWeight: "600",
  },
  bookButtonContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "20px",
  },
  totalAmount: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#333",
  },
  bookButton: {
    backgroundColor: "#5a67d8",
    color: "#fff",
    border: "none",
    padding: "15px 30px",
    fontSize: "18px",
    cursor: "pointer",
    borderRadius: "8px",
  },
};

export default BookingPage;
