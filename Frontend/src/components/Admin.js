import React, { useEffect, useState } from "react";
import axios from "axios";

const Admin = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/bookings").then((res) => {
      setBookings(res.data);
    });
  }, []);

  const updateBooking = (id, status) => {
    axios.post("http://localhost:5000/api/admin/update", { id, status }).then((res) => {
      alert(res.data.message);
    });
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      {bookings.map((booking) => (
        <div key={booking.id}>
          <p>{booking.time}</p>
          <button onClick={() => updateBooking(booking.id, "approved")}>Approve</button>
          <button onClick={() => updateBooking(booking.id, "rejected")}>Reject</button>
        </div>
      ))}
    </div>
  );
};

export default Admin;
