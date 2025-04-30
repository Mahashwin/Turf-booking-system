import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const navbarStyle = {
    backgroundColor: "#3b0086",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 20px",
  };

  const logoStyle = {
    width: "50px",
  };

  const linkStyle = {
    listStyle: "none",
    display: "flex",
    gap: "20px",
  };

  const anchorStyle = {
    color: "white",
    textDecoration: "none",
    fontWeight: "bold",
  };

  return (
    <div style={navbarStyle}>
      <div>
        {/* <img src="turflogo.jpeg" alt="Rapid" style={logoStyle} /> */}
        <ul style={linkStyle}>
        <li><Link to="/booking" style={anchorStyle}>Rapid</Link></li>
      </ul>
      </div>
      <ul style={linkStyle}>
        <li><Link to="/booking" style={anchorStyle}>Book Your Slot</Link></li>
        <li><Link to="/feedback" style={anchorStyle}>Feedback</Link></li>
        <li><Link to="/" style={anchorStyle}>Login</Link></li>
        {/* <li><Link to="/admin" style={anchorStyle}>Admin</Link></li> */}
      </ul>
    </div>
  );
};

export default Navbar;
